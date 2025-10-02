import { readEvent } from '@@/server/apiUtils/readEvent'
import { deleteItemById } from '@@/server/directus/items'
import { H3Event } from 'h3'

export default defineEventHandler(async ( event: H3Event ) => {
    // Read event and ensure token exists.
    

    try {

        const body = await readBody(event)
        const bearerToken = getHeader(event, 'authorization')
        if(!body) throw new Error('No body in request')
        if(!bearerToken) throw new Error('No bearer token provided')
        if(!body.id) throw new Error('No id in body')
        if(!body.collection) throw new Error('No collection in body')

        var v = {
            collection: body.collection,
            id: body.id,
            bearerToken: bearerToken
        }

    } catch(err) {
        throw createError({
            statusCode: 403,
            statusMessage: "Unauthorized",
            data: {
                reason: "Delete item :  failed basic validation",
                toasterPath: "error.unauthorized"
            }
        });
    }

    await deleteItemById({
        auth: v.bearerToken,
        collection: v.collection,
        id: v.id,
    })
})