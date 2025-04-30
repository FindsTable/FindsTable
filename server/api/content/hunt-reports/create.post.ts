import { readEvent } from '@/server/apiUtils/readEvent'
import { createItem, updateItemById } from '@/server/directus/items'
import { uploadFile } from '@/server/directus/files'
import { ItemObject } from '~/shared/types/dataObjects'
import { H3Event } from 'h3'
import { itemCountIsValid, validateUser, isValidImageType } from '@/server/utils/validation'
import { updateItemsCountField as incrementFindsCount } from '@/server/utils/apiContentUtils'

const bannersFolderId = 'b95762e0-8e06-4c21-878c-7ad6213ef2cf'
const bootyPhotoFolderId = 'b95762e0-8e06-4c21-878c-7ad6213ef2cf'

export default defineEventHandler(async (
event: H3Event
): Promise<ApiResponse<HuntReport | null>> => {

    const { bearerToken, error: tokenError } = await readEvent(event, ['bearerToken'])

    if (tokenError) return tokenError

    const currentUser = await validateUser({
        bearerToken: bearerToken,
        fields: [
            'id', 'huntReports_count', 'username'
        ]
    })
    if( !currentUser || !currentUser.id ) {
        return {
            ok: false,
            statusText: "User is not logged in or doesn't esist"
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
        collection: 'Hunt-reports'
    })

    if(countValid === false) {
        return {
            ok: false,
            data: null,
            statusText: 'You have reached the maximum numner of Hunt reports !'
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

        const name = entry.name

        if (name === 'report') {
            cache[name as string] = JSON.parse(entry.data.toString('utf-8'))
        } else {
            cache[name as string] = {
                data: entry.data,
                type: entry.type,
                filename: entry.filename
            }
        }
    }

    const reportId = await createItemGetId('Hunt_reports', {
        ...cache.report,
        owner: userId
    } )

    if (!reportId) {
        return {
            ok: false,
            statusText: `Failed to create main item`,
            data: cache.report
        }
    }

    cache.reportId = reportId

    if (cache.banner) {
        // Validate MIME type
        if (!isValidImageType(cache.banner.type)) {
            return {
                ok: false,
                statusText: 'Invalid banner image type. Only JPG and PNG are allowed.'
            }
        }
    
        const fileFormData = new FormData()
        const blob = new Blob([cache.banner.data], { type: cache.banner.type || 'application/octet-stream' })
    
        fileFormData.append('folder', bannersFolderId)
        fileFormData.append('Hunt_report_id', cache.reportId)
        fileFormData.append('file', blob, cache.banner.filename || 'banner.jpg')
    
        const bannerId = await uploadFileGetId(fileFormData)
    
        if (!bannerId) {
            return {
                ok: false,
                statusText: 'Could not upload banner image.'
            }
        }

        cache.bannerId = bannerId
    }
    
    if (cache.bootyPhoto) {
        // Validate MIME type
        if (!isValidImageType(cache.bootyPhoto.type)) {
            return {
                ok: false,
                statusText: 'Invalid booty photo image type. Only JPG and PNG are allowed.'
            }
        }
    
        const fileFormData = new FormData()
        const blob = new Blob([cache.bootyPhoto.data], { type: cache.bootyPhoto.type || 'application/octet-stream' })
    
        fileFormData.append('folder', bootyPhotoFolderId)
        fileFormData.append('Hunt_report_id', cache.reportId)
        fileFormData.append('file', blob, cache.bootyPhoto.filename || `hunt-report-bootyPhoto-${currentUser.username}.jpg`)
    
        const bootyPhotoId = await uploadFileGetId(fileFormData)
    
        if (!bootyPhotoId) {
            return {
                ok: false,
                statusText: 'Could not upload booty photo image.'
            }
        }
        cache.bootyPhotoId = bootyPhotoId
    }

    const report = await updateItemById<HuntReport>({
        id: cache.reportId,
        collection: 'Hunt_reports',
        auth: bearerToken,
        body: {
            banner: cache.bannerId,
            bootyPhoto: cache.bootyPhotoId
        },
        query: {
            fields: '*'
        }
    })

    if(!report?.data || !report?.ok) {
        return {
            ok: false,
            statusText: 'Could not update the new report with the banner and photo ids.'
        }
    }

    if (report.data.banner && report.data.bootyPhoto) {

        const newHuntReportsCount = await incrementFindsCount({
            bearerToken: bearerToken!,
            field: 'huntReports_count',
            newValue: currentUser.huntReports_count + 1
        })

        return {
            ok: true,
            data: report.data,
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

// Helper to upload a file and return its ID.
async function uploadFileGetId(fd: FormData): Promise<string | undefined> {
    const res = await uploadFile(fd)
    if (!res?.data?.id) {
        return undefined
    }
    return res.data.id
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