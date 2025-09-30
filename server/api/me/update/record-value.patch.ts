import { updateMe, updateUserById } from '@@/server/directus/users'
import { getItemById, updateItemById } from '@@/server/directus/items'
import { readEvent } from '@@/server/apiUtils/readEvent'
import { validateUser } from '@@/server/utils/validation'

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

    let userRes = undefined
    let isEmail = false

    if(body.key === 'email') {
        isEmail = true
        userRes = await updateMe({
            bearerToken: bearerToken!,
            body: {
                email: body.value
            },
            query: query
        })

        if(!userRes) {
            return {
                ok: false,
                statusText: 'We could not update your email address .'
            }
        }
    }

    const patchRes = await updateItemById({
        id: body.id,
        collection: 'PersonalData_values',
        auth: bearerToken!,
        body: {
            value: body.value
        },
        query: query
    })

    if(patchRes?.data) {
        return {
            ok: true,
            statusText: 'Value updated !',
            data: patchRes.data
        }
    }
    
})


async function updateEmail(email : string ) {


}