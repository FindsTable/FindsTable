import { readEvent } from '@/server/apiUtils/readEvent'
import { createItem } from '@/server/directus/items'
import { uploadFile } from '@/server/directus/files'
import { getItemById } from '@/server/directus/items'
import { ItemObject } from '~/shared/types/dataObjects'
import { H3Event } from 'h3'
import { itemCountIsValid, validateUser } from '@/server/utils/validation'
import { updateItemsCountField as incrementFindsCount } from '@/server/utils/apiContentUtils'

const findsImagesFolderId = 'b95762e0-8e06-4c21-878c-7ad6213ef2cf'

export default defineEventHandler(async <ExpectedItemObject extends ItemObject>(
event: H3Event
): Promise<ApiResponse<ExpectedItemObject | null>> => {
    // Read event and ensure token exists.
    const { bearerToken, error: tokenError } = await readEvent(event, ['bearerToken'])

    if (tokenError) return tokenError

    const currentUser = await validateUser({
        bearerToken: bearerToken!,
        fields: [
            'id', 'finds_count'
        ]
    })
    if( !currentUser || !currentUser.id ) {
        return {
            ok: false,
            statusText: 'User is not logged in or dont esist'
        }
    }

    const userId = currentUser.id

    if (!userId || typeof userId !== 'string') {
        return {
            ok: false,
            statusText: 'User is not logged in.',
            data: null
        }
    }

    const countValid = itemCountIsValid({
        items_count: currentUser.finds_count,
        collection: 'Finds'
    })

    if(countValid === false) {
        return {
            ok: false,
            data: null,
            statusText: 'You have reached the maximum numner of finds !'
        }
    }

    const fd = await readMultipartFormData(event)
    if (!fd) {
        return {
            ok: false,
            data: null,
            statusText: 'No formdata'
        }
    }

    const cache: Cache = {}

    // Populate cache: if text, convert Buffer->string->JSON if possible; if file, store the entry.
    for (const entry of fd) {
        if (entry.filename === undefined) {
        const text = entry.data.toString('utf-8')
        try {
            cache[entry.name!] = JSON.parse(text)
        } catch (e) {
            cache[entry.name!] = text
        }
        } else {
            if(entry.type !== 'image/jpeg') {
                return {
                    ok: false,
                    data: null,
                    statusText: 'The file is not a jpeg'
                }
            }
            cache[entry.name!] = entry
        }
    }

    // Check that meta data exists
    if (!cache.meta) {
        return {
        ok: false,
        statusText: 'Meta data missing',
        data: null
        }
    }

    // Create the Finds item using cache.item and the collection defined in meta.
    const createItemRes = await createItemGetId(cache.meta.collection, addOwnerId(cache.item, userId) )

    if (!createItemRes.ok) {
        return {
        ok: false,
        statusText: `Failed to create main item: ${createItemRes.statusText}`,
        data: cache.item
        }
    }

    cache.itemId = createItemRes.data

    // Process images in meta (upload file and create junction record).
    if (cache.meta.images && cache.meta.images.length) {
        let count = 1
        for (const img of cache.meta.images) {
            if(count > 2) break // extra layer of protection, limit to 2 images
            count++
            
            const fileEntry = cache[img.key]
            if (!fileEntry) continue

            const fileFormData = new FormData()
            const blob = new Blob([fileEntry.data], { type: fileEntry.type || 'application/octet-stream' })
            fileFormData.append('folder', findsImagesFolderId)
            fileFormData.append('Finds_id', cache.itemId!)
            // fileFormData.append('owner', userId)  //need to get rid of the link for cascade deletion
            fileFormData.append('file', blob, fileEntry.filename)

            const uploadRes = await uploadFileGetId(fileFormData)
            if (!uploadRes.ok) {
                return {
                ok: false,
                statusText: `Failed to upload file for key ${img.key}: ${uploadRes.statusText}`,
                data: null
                }
            }

            const fileId = uploadRes.data

            const junctionRes = await createItem({
                collection: img.collection,
                auth: 'app',
                body: {
                    Finds_id: cache.itemId,
                    directus_files_id: fileId
                },
                query: {
                    fields: 'id'
                }
            })

            if (!junctionRes.ok) {
                return {
                ok: false,
                statusText: `Failed to create junction record for file ${fileId}: ${junctionRes.statusText}`,
                data: null
                }
            }
        }
    }

    // Retrieve the final Finds item.
    const itemRes = await getItemById({
        collection: 'Finds',
        auth: 'app',
        id: cache.itemId!
    })

    if (itemRes.ok && itemRes.data) {

        const newFindsCount = await incrementFindsCount({
            bearerToken: bearerToken!,
            field: 'finds_count',
            newValue: currentUser.finds_count + 1
        })

        return {
            ok: true,
            data: {
                ...itemRes.data,
                finds_count: newFindsCount
            },
            statusText: 'Success'
        }
    }

    return {
        ok: false,
        statusText: 'Failed to retrieve item after creation',
        data: null
    }
  
})

// Helper to create an item and return its ID.
async function createItemGetId(collection: string, item: any): Promise<SimpleResponse> {
    const res = await createItem<any>({
        auth: "app",
        collection: collection,
        body: item,
        query: {
            fields: 'id'
        }
    })

    if (!res.ok) {
        return { ok: false, statusText: res.statusText }
    }
    return { ok: true, statusText: 'Created', data: res.data.id }
}

// Helper to upload a file and return its ID.
async function uploadFileGetId(fd: FormData): Promise<SimpleResponse> {
    const res = await uploadFile(fd)
    if (!res.ok) {
        return { ok: false, statusText: res.statusText }
    }
    return { ok: true, statusText: 'Uploaded', data: res.data.id }
}

function addOwnerId(item : any, id : string) {
    return {
        ...item,
        owner: id
    }
}

interface MetaImage {
    key: string;
    collection: string;
    role?: string;
}

interface MetaData {
    collection: string;
    images?: MetaImage[];
}

interface Cache {
    [key: string]: any;
    meta?: MetaData;
    item?: any;
    itemId?: string;
}

interface SimpleResponse {
    ok: boolean;
    statusText: string;
    data?: any;
}