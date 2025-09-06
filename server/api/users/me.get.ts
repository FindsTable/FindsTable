import { getMe } from '@@/server/directus/users'
import { readEvent } from '@@/server/apiUtils/readEvent'

export default defineEventHandler( async <
    ExpectedUserObject extends UserObject
> (
    event: H3Event
)
: Promise<
    ApiResponse<ExpectedUserObject | null>
> => {

    const { bearerToken, query, error } = await readEvent(event, ['bearerToken', 'query'])

    if(error) return error
    
    const me = await getMe<ExpectedUserObject>({
        bearerToken,
        query: query!
    })

    // this should be handled by the function requesting patreon_account
    if(me.data?.patreon_account === undefined) {
        delete me.data?.patreon_account
    }
    return me
})