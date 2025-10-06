import {
    patreon_getTokensWithCode,
    patreon_getMe,
    formatUserState_Patreon,
    refactorTokens
} from '@@/server/patreon/account'
import { userGet, appPost, appPatch } from '@@/server/directus/request'


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
    
    const formatedPatreonAccount = formatUserState_Patreon(patreonMe)

    const newPatreonAccount = await appPost({
        endpoint: '/items/Patreon_accounts',
        body: {
            user: bodyUserId, 
            ...formatedPatreonAccount
        },
        query: {
            fields: '*'
        }
    })

    try {
        appPost({
            endpoint: `/items/Badge_records_Success_badges`,
            body: {
                Badge_records_id: bodyUserId,
                Success_badges_key: 'patreonLinked'
            }
        })
    } catch(err) {
        console.log('TO DO : log the error to repair it !')
    }

    return newPatreonAccount
});