import { userDelete } from '@@/server/directus/request'

export default defineEventHandler(async ( event ) => {
    try {
        const body = await readBody(event)
        const bearerToken = getHeader(event, 'authorization')
        if(!body) throw new Error('No body in request')
        if(!bearerToken) throw new Error('No bearer token provided')
        if(!body.id) throw new Error('No id in body')
        if(!body.collection) throw new Error('No collection in body')

        await userDelete({
            bearerToken: bearerToken,
            endpoint: `/items/${body.collection}/${body.id}`
        })
    } catch(err : any) {
        throw newError({
            code: 403,
            message: "Unauthorized",
            reason: err.message
        });
    }
})