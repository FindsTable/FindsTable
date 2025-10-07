import { H3Event } from 'h3'
import { assertItemCount } from '@@/server/utils/validation'
import { userGet, appPost, appPatch } from '@@/server/directus/request'

const findsImagesFolderId = '19ec239d-432b-44c7-911d-46cf61743931'

export default defineEventHandler(async <T>(
event: H3Event
): Promise<any> => {
    // Read event and ensure token exists.
    const bearerToken = getHeader(event, 'authorization')

    if(!bearerToken) throw newError({
        code: 403,
        message: "Bad request",
        reason: "Missing body or bearerToken"
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
        collection: 'Finds',
        userId: userId
    })
    

    const fd = await readMultipartFormData(event)

    if (!fd || fd.length > 3) {
        throw newError({
            code: 400,
            message: "Bad request",
            reason: !fd ? "No formData found in request" : 'Too many entries in formData'
        })
    }
    
    const cache: Cache = {
        body: {
            find: undefined,
            image0: undefined,
            image1: undefined
        },
        newFindId: undefined,
        newFiles: {
            image0Id: undefined,
            image1Id: undefined
        }
    }

    for (const entry of fd) {
        if (entry.name === 'item') {
            cache.body.find = JSON.parse(entry.data.toString('utf-8'))
        } else if (entry.name === 'image0' || entry.name === 'image1') {

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


    if (cache.body.image0) {
        const fileFormData = new FormData()
        const blob = new Blob(
            [cache.body.image0.data],
            { type: cache.body.image0.type || 'application/octet-stream' }
        )

        fileFormData.append('folder', findsImagesFolderId)
        fileFormData.append('file', blob, cache.body.image0.filename || 'image0.webp')

        const { id: image0Id } = await appPost<{id: string}>({
            endpoint: '/files',
            body: fileFormData,
            query: {
                fields: 'id'
            }
        })

        cache.newFiles.image0Id = image0Id
    }

    try {
        const { id : newFindId } = await appPost<{id: string}>({
            endpoint: '/items/Finds',
            body: {
                ...cache.body.find,
                owner: userId
            },
            query: {
                fields: '*'
            }
        })

        cache.newFindId = newFindId

        if (cache.body.image1) {
            const fileFormData = new FormData()
            const blob = new Blob(
                [cache.body.image1.data],
                { type: cache.body.image1.type || 'application/octet-stream' }
            )

            fileFormData.append('folder', findsImagesFolderId)
            fileFormData.append('file', blob, cache.body.image1.filename || 'image1.webp')

            const { id : image1Id } = await appPost<{id: string}>({
                endpoint: '/files',
                body: fileFormData,
                query: {
                    fields: 'id'
                }
            })

            cache.newFiles.image1Id = image1Id

        }
        const updateImage0 = {
            id: cache.newFiles.image0Id,
            Finds_id: cache.newFindId
        }

        const updateImage1 = {
            id: cache.newFiles.image1Id,
            Finds_id: cache.newFindId
        }

        const { id: updatedFindId } = await appPatch<{id: string}>({
            endpointId: `/items/Finds/${cache.newFindId}`,
            body: {
                image0: cache.body.image0 ? updateImage0 : undefined,
                image1: cache.body.image1 ? updateImage1 : undefined
            },
            query: {
                fields: 'id'
            }
        })

        return updatedFindId

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
        find?: any;
        image0: undefined | {
            type?: string;
            data?: any;
            filename?: string;
        };
        image1: undefined |{
            type?: string;
            data?: any;
            filename?: string;
        };
    };
    newFindId?: string;
    newFiles: {
        image0Id?: string,
        image1Id?: string
    }
}
