import { getUserById } from '@/server/directus/users'
import { readEvent } from '@/server/apiUtils/readEvent'

export default defineEventHandler( async <
    Data extends UserObject
> (
    event: H3Event
)
: Promise<
    ApiResponse<Data | null>
> => {

    const {
        bearerToken,
        id,
        query,
        error
    } = await readEvent(event, [ 'bearerToken', 'paramId', 'query'])

    if(error) return error

    const res = await getUserById<Data>({
        id: id,
        auth: bearerToken,
        query: query ? query : {}
    })

    return res

})