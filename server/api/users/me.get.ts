import { userGet } from '@@/server/directus/request'

export default defineEventHandler( async <T> (
    event: H3Event
)
: Promise<T> => {

    const query = getQuery(event)
    const bearerToken = getHeader(event, 'authorization')

    if(!query || !bearerToken) throw newError({
        code: 400,
        message: 'Bad request',
        reason: 'No query in request'
    })
    
    const me = await userGet<any>({
        endpoint: '/users/me',
        bearerToken,
        query: query!
    })

    // this should be handled by the function requesting patreon_account
    if(me.data?.patreon_account === undefined) {
        delete me.data?.patreon_account
    }

    return me
})