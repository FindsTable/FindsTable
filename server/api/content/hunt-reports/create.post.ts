
import { createItem } from '@@/server/directus/items'
import { 
    addFileToItem
 } from '@@/server/directus/files'

import { H3Event } from 'h3'
import { assertItemCount, getUserId, isValidImageType } from '@@/server/utils/validation'


const bootyPhotoFolderId = 'e6a6fb54-9c40-4b1d-ae78-c438dc39452b'

export default defineEventHandler(
    async (event: H3Event
): Promise<any> => {

    const bearerToken = getHeader(event, 'authorization')
    if(!bearerToken) throw newError({
        code: 400,
        message: 'Unauthorized',
        reason: 'No bearer token'
    })

    const userId = await getUserId(bearerToken)

    await assertItemCount({
        collection: 'Hunt_reports',
        userId: userId
    })

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
        linkedFinds?: string[]
        bootyPhoto?: {
            type: string | undefined
            data: any
            filename: string | undefined
        }
        // id's from directus
        reportId?: ReportId 
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
            cache[name as 'bootyPhoto'] = {
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

    }

    cache.reportId = reportId
    

    /*
*
*
*   Handle banner from the request
* 
* 
    */

    if (cache.bootyPhoto) {
        // Validate MIME type
        if (!isValidImageType(cache.bootyPhoto.type)) {
            return {
                ok: false,
                statusText: 'Invalid banner image type. Only JPG and PNG are allowed.'
            }
        }
    
        const fileFormData = new FormData()
        const blob = new Blob(
            [cache.bootyPhoto.data], 
            { 
                type: cache.bootyPhoto.type || 'application/octet-stream' 
            }
        )
    
        fileFormData.append('folder', bootyPhotoFolderId)
        fileFormData.append('Hunt_report_id', cache.reportId)
        fileFormData.append('file', blob, cache.bootyPhoto.filename || 'bootyOfFinds.jpg')
    
        const bootyPhotoRes = await addFileToItem({
            file: fileFormData,
            item: {
                id: reportId,
                collection: 'Hunt_reports',
                field: {
                    name: 'bootyPhoto'
                }
            }
        })

        const newFile = bootyPhotoRes.file

        if(!newFile.uploaded) {
            return {
                ok: false,
                statusText: "Booty photo could not be uploaded"
            }
        }
        if(!newFile.linked) {
            return {
                ok: false,
                statusText: "Booty photo  could not be linked to item"
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
type findId = string

type huntReportFromRequest = {
    title: string
    content: string
    date: string
    biome: string
    finds: findId[]
}