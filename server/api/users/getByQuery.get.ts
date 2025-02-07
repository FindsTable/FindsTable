import { readEvent } from "@/server/apiUtils/readEvent"
import { getUsersByQuery } from '@/server/directus/users'

export default defineEventHandler( async <
    ExpectedUserObject extends UserObject
> (
    event: H3Event
)
: Promise<
    ApiResponse<ExpectedUserObject[] | null>
> => {
    
    const {
        bearerToken,
        query,
        error
    } = await readEvent(event, [ 'bearerToken', 'query'])

    if(error) return error

    const res = await getUsersByQuery<ExpectedUserObject>({
        auth: bearerToken,
        query: query!
    })

    return res
})