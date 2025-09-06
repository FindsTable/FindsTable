import { createItem } from '../../../directus/items'
import { getMe } from '@@/server/directus/users'
import {
    patreon_getTokensWithCode,
    patreon_getMe,
    formatUserState_Patreon,
    refactorTokens
} from '../../../patreon/account'


export default defineEventHandler(async (event) => {
    

    const body = await readBody(event)
    const stateToken = body.state
    const patreonCode = body.code
    const bodyUserId = body.userId

    const bearerToken = getHeader(event, "Authorization")

    if (!bearerToken) {
        return newResponse({
            ok: false,
            status: 401,
            statusText: 'Auth header in null'
        })
    }

    const res_me = await getMe({
        bearerToken: bearerToken,
        query: {
            fields: 'id,patreon_stateToken'
        }
    })
    
    if (!res_me) {
        return newResponse({
            ok: false,
            status: 500,
            statusText: 'Server error, could not get userMe'
        })
    }
    if (!res_me.ok && !res_me.data) {
        return {
            info: res_me
        }
    }
    if (!userIdIsValid(bodyUserId, res_me.data.id)) {
        return newResponse({
            ok: false,
            status: 401,
            statusText: 'User id not valid',
        })
    }
    
    if (!stateTokensAreIdentical(stateToken, res_me.data.patreon_stateToken)) {
        return newResponse({
            ok: false,
            status: 401,
            statusText: 'State token are not identical',
        })
    }
    
    const tokens = await patreon_getTokensWithCode(patreonCode)

    if (!tokens) {
        return newResponse({
            ok: false,
            status: 401,
            statusText: 'No tokens from patreon'
        })
    }
    
    const refactoredTokens = refactorTokens(tokens.data)

    const patreonMe = await patreon_getMe(`Bearer ${refactoredTokens.access_token}`)

    const userState_patreon = formatUserState_Patreon(patreonMe.data, refactoredTokens)
    
    const res_newItem = await createItem({
        collection: 'Patreon_accounts',
        auth: bearerToken,
        body: {
            user: bodyUserId, 
            id: userState_patreon.id,
            tier: userState_patreon.tier,
            ...refactoredTokens
        },
        query: {
            fields: 'user'
        }
    })

    if (!res_newItem) {
        return newResponse({
            ok: false,
            status: 500,
            statusText: 'Server error while creatin new patreon account'
        })
    }
    if (!res_newItem.ok) {
        return res_newItem
    }

    return newResponse({
        ok: true,
        status: 200,
        statusText: 'ok',
        data: userState_patreon,
        feedback: {
            toaster: {
                messagePath: 'success.patreon.account.linked',
                type: 'success'
            }
        }
    })

});

function stateTokensAreIdentical(token1: string, token2: string) {
    return token1 === token2
}



function userIdIsValid(idFromRequestBody: string, idFromDirectusAccount: string) {
    return idFromRequestBody === idFromRequestBody
}