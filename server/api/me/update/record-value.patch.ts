import { updateMe } from '@@/server/directus/users'
import { userPatch } from '@@/server/directus/request'

export default defineEventHandler( async <
    ExpectedUserObject extends UserObject
> (
    event: H3Event
)
: Promise<any> => {

    const bearerToken = getHeader(event, 'authorization')
    if(!bearerToken) throw newError({
        code: 400,
        message: "Bad request",
        reason: 'Basic validation failed'
    })

    await userIsValid(bearerToken)

    const body = await readBody(event)
    const query = getQuery(event)

    if(!body) throw newError({
        code: 400,
        message: "Bad request",
        reason: 'Basic validation failed'
    })

    if(body.email) assertEmailFormat(body.email)

    const res = await userPatch({
        endpoint: '/users/me',
        bearerToken,
        body,
        query
    })

    if(!res) throw new Error()
    return res
})
