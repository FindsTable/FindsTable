import{ userGet } from '@@/server/directus/request'

export default defineEventHandler(async (
    event
): Promise<FT_patreon_account> => {

    const query = getQuery(event)
    const bearerToken = getHeaders(event).authorization

    if(!bearerToken) throw newError({
        code: 403,
        message: 'Unauthorized',
        reason: 'No bearerToken'
    })
    if(!query.userId) throw newError({
        code: 403,
        message: 'Bad request',
        reason: 'Missin user id'
    })

    const account = await userGet<FT_patreon_account>({
        endpoint: '/items/Patreon_accounts',
        bearerToken,
        query
    })

    return account
})