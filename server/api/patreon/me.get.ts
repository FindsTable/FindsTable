import { PatreonUser } from '@@/server/types/patreon'
import { patreon_getMe, formatUserState_Patreon } from '../../patreon/account'

export default defineEventHandler(async (
    event
): Promise<ApiResponse<PatreonUser | null>> => {

    const bearerToken = getHeaders(event).authorization

    if (bearerToken === undefined) {
        return newResponse({
            ok: false,
            status: 401,
            statusText: 'Unauthorized'
        })
    }

    const res = await patreon_getMe(bearerToken)

    if(!res.ok) {
        return newResponse({
            ok: false,
            status: 500,
            statusText: 'Internal Server Error'
        })
    }

    const patreonUser: PatreonUser = formatUserState_Patreon(res.data, undefined)

    return newResponse({
        ok: true,
        status: 200,
        statusText: 'OK',
        data: patreonUser
    })
})