import { readEvent } from '@/server/apiUtils/readEvent'
import { createItem, updateItemById } from '@/server/directus/items'
import { 
    uploadFile,
    addFileToItem
 } from '@/server/directus/files'
import { ItemObject } from '~/shared/types/dataObjects'
import { H3Event } from 'h3'
import { itemCountIsValid, validateUser, isValidImageType } from '@/server/utils/validation'
import { updateItemsCountField } from '@/server/utils/apiContentUtils'

const bannersFolderId = '23890189-57ac-49ff-96ca-39bffac3c7eb'
const bootyPhotoFolderId = 'e6a6fb54-9c40-4b1d-ae78-c438dc39452b'

export default defineEventHandler(async (
event: H3Event
): Promise<ApiResponse<ReportId | null>> => {

    const { bearerToken, error: tokenError } = await readEvent(event, ['bearerToken'])

    if (tokenError) return tokenError

/*
/   Validation
        -user
        -number of hunt report
*/
    
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
        items_count: currentUser.huntReports_count,
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

    if (fd.length > 5) {
        return {
            ok: false,
            statusText: `Too many form entries in the formData.`
        };
    }

/*
    Parse the form data and store in a cache object
*/

    interface Cache {
        report?: huntReportFromRequest
        banner?: {
            type: string | undefined
            data: any
            filename: string | undefined
        }
        bootyPhoto?: {
            type: string | undefined
            data: any
            filename: string | undefined
        }
        // id's from directus
        reportId?: ReportId 
        bannerId?: string
        bootyPhotoId?: string
    }

    const cache: Cache = {}

    /*
*
*
*   Allowed entry names for the formData from the request
* 
* 
    */
    const nameOfFormDataEntries = [
        'report',
        'banner',
        'bootyPhoto',
        'photos'
    ]

    // Populate cache: if text, convert Buffer->string->JSON if possible; if file, store the entry.
    for (const entry of fd) {
        
        const name = entry.name

        if(
            typeof name !== 'string' ||
            !nameOfFormDataEntries.includes(name)
        ) {
            return {
                ok: false,
                statusText: `Unexpected form entry: ${name}.`
            };
        }

        if (name === 'report') {
            cache[name as 'report'] = JSON.parse(entry.data.toString('utf-8'))
        } else {
            cache[name as 'banner' | 'bootyPhoto'] = {
                data: entry.data,
                type: entry.type,
                filename: entry.filename
            }
        }
    }

    /*
*
*
*   Create the hunt report object and get the id
*  
* 
    */

    const reportId = await createItemGetId('Hunt_reports', {
        ...cache.report,
        owner: userId
    } )

    if (!reportId) {
        return {
            ok: false,
            statusText: `Failed to create main item`,
            data: undefined
        }
    } else {
        const newHuntReportsCount = await updateItemsCountField({
            bearerToken: bearerToken!,
            field: 'huntReports_count',
            newValue: currentUser.huntReports_count + 1
        })
    }

    cache.reportId = reportId

    /*
*
*
*   Handle banner from the request
* 
* 
    */

    if (cache.banner) {
        // Validate MIME type
        if (!isValidImageType(cache.banner.type)) {
            return {
                ok: false,
                statusText: 'Invalid banner image type. Only JPG and PNG are allowed.'
            }
        }
    
        const fileFormData = new FormData()
        const blob = new Blob(
            [cache.banner.data], 
            { 
                type: cache.banner.type || 'application/octet-stream' 
            }
        )
    
        fileFormData.append('folder', bannersFolderId)
        fileFormData.append('Hunt_report_id', cache.reportId)
        fileFormData.append('file', blob, cache.banner.filename || 'banner.jpg')
    
        const bannerRes = await addFileToItem({
            file: fileFormData,
            item: {
                id: reportId,
                collection: 'Hunt_reports',
                field: {
                    name: 'banner'
                }
            }
        })

        const newFile = bannerRes.file

        if(!newFile.uploaded) {
            return {
                ok: false,
                statusText: "FBanner could not be uploaded"
            }
        }
        if(!newFile.linked) {
            return {
                ok: false,
                statusText: "Banner could not be linked to item"
            }
        }

        if(newFile.id) {
            cache.bannerId = newFile.id
        }
    }

    /*
*
*
*   Handle Booty Photo from the request
* 
* 
    */
    
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
    
        const bootyPhotoRes = await addFileToItem({
            file: fileFormData,
            item: {
                id: reportId,
                collection: 'Hunt_reports',
                field: {
                    name: 'banner'
                }
            }
        })

        const newFile = bootyPhotoRes.file

        if(!newFile.uploaded) {
            return {
                ok: false,
                statusText: "FBanner could not be uploaded"
            }
        }
        if(!newFile.linked) {
            return {
                ok: false,
                statusText: "Banner could not be linked to item"
            }
        }

        if(newFile.id) {
            cache.bootyPhotoId = newFile.id
        }
    }

    return {
        ok: true,
        statusText: 'Success',
        data: cache.reportId
    }
})

// Helper to create an item and return its ID.

async function createItemGetId(
    collection: string, 
    item: any
): Promise<string | undefined> {
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

type ReportId = string

interface Cache {
    report?: huntReportFromRequest
    banner?: {
        type: string | undefined
        data: any
        filename: string | undefined
    }
    bootyPhoto?: {
        type: string | undefined
        data: any
        filename: string | undefined
    }
    // id's from directus
    reportId?: ReportId 
    bannerId?: string
    bootyPhotoId?: string
}

type huntReportFromRequest = {
    title: string
    content: string
    date: string
    biome: string
}