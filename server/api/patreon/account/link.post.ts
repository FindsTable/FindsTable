import {
    patreon_getTokensWithCode,
    patreon_getMe,
    formatUserState_Patreon,
    refactorTokens
} from '@@/server/patreon/account'
import { userGet, appPost } from '@@/server/directus/request'


export default defineEventHandler(async (event) => {

    const body = await readBody(event)
    const stateToken = body.state
    const patreonCode = body.code
    const bodyUserId = body.userId

    const bearerToken = getHeader(event, "Authorization")

    if(!body || !stateToken || !patreonCode || !bodyUserId || !bearerToken) {
        throw newError({
            code: 400,
            message: 'Bad request',
            reason: 'Request is missing critical data'
        })
    }

    const user = await userGet<any>({
        endpoint: '/users/me',
        bearerToken: bearerToken,
        query: {
            fields: 'id,patreon_stateToken'
        }
    })

    assertStrongEquality(bodyUserId, user.id)

    assertStrongEquality(stateToken, user.patreon_stateToken)
    
    const tokens = await patreon_getTokensWithCode(patreonCode)

    const refactoredTokens = refactorTokens(tokens)

    const patreonMe = await patreon_getMe(`Bearer ${refactoredTokens.access_token}`)

    const patreonAccount = formatUserState_Patreon(patreonMe)

    const res = await appPost({
        endpoint: '/items/Patreon_accounts',
        body: {
            user: bodyUserId, 
            ...patreonAccount
        },
        query: {
            fields: '*'
        }
    })

    return res
});