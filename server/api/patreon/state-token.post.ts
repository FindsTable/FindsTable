import crypto from 'crypto';
import { userGet, appPatch, appGet } from '@@/server/directus/request'

export default defineEventHandler(async (event) => {

    const bearerToken = getHeader(event, 'authorization')

    if(!bearerToken) throw newError({
        code: 400,
        message: 'Bad request',
        reason: 'No token in request'
    })

    const user = await userGet<{id: string}>({
        endpoint: '/users/me',
        bearerToken: bearerToken,
        query: {
            fields: 'id'
        }
    })


    const body = await readBody(event);

    //compare userId from request to userId from directus
    assertStrongEquality(user.id, body.userId)

    try {
        const stateToken = crypto.randomBytes(16).toString('hex')

        //store token in user's profile in DIrectus
        const res = await appPatch<{patreon_stateToken: string}>({
            endpointId: `/users/${body.userId}`,
            body: {
                patreon_stateToken: stateToken
            },
            query: {
                fields: 'patreon_stateToken'
            }
        })

        return res.patreon_stateToken
    } catch(err) {
        throw newError({
            code: 500,
            message: 'Request failed',
            reason: 'Could not set state token in user account/'
        })
    }

})