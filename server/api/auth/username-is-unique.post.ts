import { appGet } from '~~/server/directus/request'

export default defineEventHandler( async(
    event
): Promise<void> => {

    const body = await readBody(event)

    if(!body) throw newError({
        code: 400,
        message: 'Bad request',
        reason: 'No body in request'
    })

    const res = await appGet<[]>({
        endpoint: '/users',
        query: {
            filter: {
                username: {
                    _eq: `@${body.username}`
                }
            },
            fields: 'id'
        }
    })

    if(res.length) throw toasterError({
        code: 403,
        message: 'Unauthorized',
        reason: 'Username is not unique',
        toasterPath: 'error.username.notUnique'
    })
})