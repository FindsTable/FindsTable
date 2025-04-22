import { updateMe } from '@/server/directus/users'
import { getItemById, updateItemById } from '@/server/directus/items'
import { readEvent } from '@/server/apiUtils/readEvent'
import { validateUser } from '@/server/utils/validation'

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

    const user = await validateUser({
        bearerToken: bearerToken!,
        fields: [
            'id'
        ]
    })

    if(!user || !user.id) {
        return newResponse({
            ok: false,
            statusText: 'User unknown'
        })
    }

    const patchRes = await updateMe({
        bearerToken: bearerToken!,
        body: body,
        query: query
    })
    console.log(patchRes)

    return patchRes
})


async function updateEmail(email : string ) {


}