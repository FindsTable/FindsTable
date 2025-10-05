import { updateMe } from '@@/server/directus/users'
import { assertUserIsValid } from '@@/server/utils/validation'

export default defineEventHandler( async <T> (
    event: H3Event
)
: Promise<T> => {

    const body = await readBody(event)
    const bearerToken = getHeader(event, 'authorization')
    const query = getQuery(event)

    if (!body?.item || !bearerToken || !body.userId || !query) {
        throw newError({
            code: 400,
            message: 'Bad request.',
            reason: "request body missing data"
        })
    }

    await assertUserIsValid(bearerToken)

    const patchRes = await updateMe({
        bearerToken: bearerToken!,
        body: body,
        query: query
    })

    return patchRes
})


async function updateEmail(email : string ) {


}