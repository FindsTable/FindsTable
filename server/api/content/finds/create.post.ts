import { readEvent } from '@@/server/apiUtils/readEvent'
import { createItem } from '@@/server/directus/items'
import { addFileToItem } from '@@/server/directus/files'
import { getItemById } from '@@/server/directus/items'
import { ItemObject } from '#shared/types/dataObjects'
import { H3Event } from 'h3'
import { itemCountIsValid, validateUser, isValidImageType } from '@@/server/utils/validation'
import { updateItemsCountField as incrementFindsCount } from '@@/server/utils/apiContentUtils'

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
            'id', 'username', 'status', 'finds_count'
        ]
    })
    if( !currentUser || !currentUser.id ) {
        return {
            ok: false,
            statusText: 'User is not logged in or does not exist'
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
            statusText: 'You have reached the maximum number of finds!'
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

    // Process form data
    for (const entry of fd) {
        if (entry.name === 'item') {
            cache.item = JSON.parse(entry.data.toString('utf-8'))
        } else if (entry.name === 'image0' || entry.name === 'image1') {
            if (!isValidImageType(entry.type)) {
                return {
                    ok: false,
                    data: null,
                    statusText: 'Invalid image type. Only webp is allowed.'
                }
            }
            cache[entry.name] = {
                data: entry.data,
                type: entry.type,
                filename: entry.filename
            }
        }
    }

    if (!cache.item) {
        return {
            ok: false,
            statusText: 'Item data missing',
            data: null
        }
    }

    // Create the Finds item
    const createItemRes = await createItemGetId('Finds', {
        ...cache.item,
        owner: userId
    })

    if (!createItemRes) {
        return {
            ok: false,
            statusText: 'Failed to create find item',
            data: null
        }
    }

    cache.itemId = createItemRes

    // Handle image0
    if (cache.image0) {
        const fileFormData = new FormData()
        const blob = new Blob(
            [cache.image0.data],
            { type: cache.image0.type || 'application/octet-stream' }
        )

        fileFormData.append('folder', findsImagesFolderId)
        fileFormData.append('Finds_id', cache.itemId)
        fileFormData.append('file', blob, cache.image0.filename || 'image0.webp')

        const image0Res = await addFileToItem({
            file: fileFormData,
            item: {
                id: cache.itemId,
                collection: 'Finds',
                field: {
                    name: 'image0'
                }
            }
        })

        if (!image0Res.file.uploaded || !image0Res.file.linked) {
            return {
                ok: false,
                statusText: 'Failed to upload and link image0',
                data: null
            }
        }
    }

    // Handle image1
    if (cache.image1) {
        const fileFormData = new FormData()
        const blob = new Blob(
            [cache.image1.data],
            { type: cache.image1.type || 'application/octet-stream' }
        )

        fileFormData.append('folder', findsImagesFolderId)
        fileFormData.append('Finds_id', cache.itemId)
        fileFormData.append('file', blob, cache.image1.filename || 'image1.webp')

        const image1Res = await addFileToItem({
            file: fileFormData,
            item: {
                id: cache.itemId,
                collection: 'Finds',
                field: {
                    name: 'image1'
                }
            }
        })

        if (!image1Res.file.uploaded || !image1Res.file.linked) {
            return {
                ok: false,
                statusText: 'Failed to upload and link image1',
                data: null
            }
        }
    }

    // Increment the user's find count
    const newFindsCount = await incrementFindsCount({
        bearerToken: bearerToken!,
        field: 'finds_count',
        newValue: currentUser.finds_count + 1
    })

    // Return the created item with updated find count
    const itemRes = await getItemById({
        collection: 'Finds',
        auth: 'app',
        id: cache.itemId
    })

    if (itemRes.ok && itemRes.data) {
        return {
            ok: true,
            data: itemRes,
            statusText: 'Success'
        }
    }

    return {
        ok: false,
        statusText: 'Failed to retrieve item after creation',
        data: null
    }
})

// Helper to create an item and return its ID
async function createItemGetId(collection: string, item: any): Promise<string | undefined> {
    const res = await createItem<any>({
        auth: "app",
        collection: collection,
        body: item,
        query: {
            fields: 'id'
        }
    })

    if (!res.ok || !res.data) {
        return undefined
    }
    return res.data.id
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
    item?: any;
    itemId?: string;
    image0?: {
        type: string | undefined;
        data: any;
        filename: string | undefined;
    };
    image1?: {
        type: string | undefined;
        data: any;
        filename: string | undefined;
    };
}

interface SimpleResponse {
    ok: boolean;
    statusText: string;
    data?: any;
}