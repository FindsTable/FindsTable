import { userGet } from '@@/server/directus/request'

export default defineEventHandler(async (
    event: H3Event
): Promise<any> => {

    const body = await readBody(event)
    const bearerToken = getHeader(event, 'authorization')

    if(!body || !bearerToken) throw newError({
        code: 403,
        message: "Bad request",
        reason: "Missing body or bearerToken"
    })

    const currentUser = await userGet<{
        id: string,
        username: string
    }>({
        endpoint: '/user/me',
        bearerToken: bearerToken,
        query: {
            fields: 'id,username'
        }
    })
    
    // user needs to confirm their username for security
    if(
            body.confirmation !== body.username  
        ||  body.confirmation !== currentUser.username
        ||  body.username !== currentUser.username
    ) { 
         throw newError({
            code: 403,
            message: "Bad request",
            reason: "Could not match the confirmation strings"
        })
    }

    await $fetch(
        `https://admin.findstable.net/users/${currentUser.id}`,
        {
            method: 'DELETE',
            headers: {
                authorization: bearerToken
            }
        }
    )
})