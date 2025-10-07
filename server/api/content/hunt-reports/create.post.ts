import { userGet, appPost, appPatch, userDelete } from '@@/server/directus/request'
import { H3Event } from 'h3'
import { assertItemCount, isValidImageType } from '@@/server/utils/validation'


const bootyPhotoFolderId = 'e6a6fb54-9c40-4b1d-ae78-c438dc39452b'

type NewReportId = string
export default defineEventHandler(
    async (event: H3Event
): Promise<NewReportId | void> => {

    const bearerToken = getHeader(event, 'authorization')
    if(!bearerToken) throw newError({
        code: 400,
        message: 'Unauthorized',
        reason: 'No bearer token'
    })

    const { id : userId} = await userGet<{
        id: string
    }>({
        endpoint: '/users/me',
        bearerToken: bearerToken,
        query: {
            fields: 'id'
        }
    })

    if( !userId ) {
        throw newError({
            code: 403,
            message: "Unauthorized",
            reason: "User not logged in"
        })
    }


    await assertItemCount({
        collection: 'Hunt_reports',
        userId: userId
    })

    const fd = await readMultipartFormData(event)

    if (!fd || fd.length > 2) {
        throw newError({
            code: 400,
            message: "Bad request",
            reason: !fd ? "No formData found in request" : `formData has more than 2 entries`
        })
    }

    const cache : Cache = {
        body: {
            report: undefined,
            bootyPhoto: {
                type: undefined,
                data: undefined,
                filename: undefined
            }
        },
        newReportId: undefined,
        newFiles: {
            bootyPhotoId: undefined
        }
    }

     for (const entry of fd) {
        if (entry.name === 'report') {
            cache.body.report = JSON.parse(entry.data.toString('utf-8'))
        } else if (entry.name === 'bootyPhoto') {

            if (!isValidImageType(entry.type)) {
                
                throw newError({
                    code: 400,
                    message: "Bad request",
                    reason: 'Invalid image type. Only webp is allowed.'
                })
            }

            cache.body[entry.name] = {
                data: entry.data,
                type: entry.type,
                filename: entry.filename
            }
            
        }
    }

    try {
        const { id : newReportId } = await appPost<{id: string}>({
            endpoint: '/items/Hunt_reports',
            body: {
                ...cache.body.report,
                owner: userId
            },
            query: {
                fields: '*'
            }
        })

        if (cache.body.bootyPhoto.data) {
            const fileFormData = new FormData()
            const blob = new Blob(
                [cache.body.bootyPhoto.data],
                { type: cache.body.bootyPhoto.type || 'application/octet-stream' }
            )

            fileFormData.append('folder', bootyPhotoFolderId)
            fileFormData.append('file', blob, cache.body.bootyPhoto.filename || 'image0.webp')

            const { id: bootyPhotoId } = await appPost<{id: string}>({
                endpoint: '/files',
                body: fileFormData,
                query: {
                    fields: 'id'
                }
            })

            cache.newFiles.bootyPhotoId = bootyPhotoId
        }

        cache.newReportId = newReportId

        const { id: updatedReportId } = await appPatch<{id: NewReportId}>({
            endpointId: `/items/Hunt_reports/${cache.newReportId}`,
            body: {
                bootyPhoto: {
                    id: cache.newFiles.bootyPhotoId,
                    Hunt_report_id: cache.newReportId
                }
            },
            query: {
                fields: 'id'
            }
        })

        return updatedReportId

    } catch(err) {
        cancelTransaction(cache)
    }

})

async function cancelTransaction(cache: Cache) {
    throw toasterError({
        code: 400,
        message: "Bad request",
        toasterPath: "form.find.creationFailed",
        reason: 'The transaction failed'
    })
}

interface Cache {
    body: {
        report?: any;
        bootyPhoto: {
            type?: string;
            data?: any;
            filename?: string;
        }
    };
    newReportId?: string;
    newFiles: {
        bootyPhotoId?: string
    }
}