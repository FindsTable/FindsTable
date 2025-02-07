import { updateMe } from '@/server/directus/users'
import { readEvent } from '@/server/apiUtils/readEvent'

export default defineEventHandler( async <
    ExpectedUserObject extends UserObject
> (
    event: H3Event
)
: Promise<
    ApiResponse<ExpectedUserObject | null>
> => {

    const {
        bearerToken,
        body,
        query,
        error
    } = await readEvent(event, [ 'bearerToken', 'body', 'query'])

    if(error) return error

    const res = await updateMe<ExpectedUserObject>({
        bearerToken: bearerToken!,
        body,
        query: query!
    })

    return res
})