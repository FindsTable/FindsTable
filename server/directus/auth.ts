import { directusAPI } from "./main"
import { ApiResponse } from '#shared/types/apiResponse'
import { createItem } from '@@/server/directus/items'

export {
    loginWithEmailAndPassword,
    createUser,
    refreshTokens
}

async function loginWithEmailAndPassword(
    email: string, 
    password: string
): Promise<ApiResponse<DirectusTokens | null>> {

    const res = await directusAPI({
        endPoint: '/auth/login',
        method: 'POST',
        auth: 'public',
        body: {
            email,
            password
        }
    })

    if(!res.data) {
        return handleNoDataError('No data returned in /auth/login => loginWithEmailAndPassword()')
    }

    return res
}

async function createUser<
    ExpectedUserObject extends UserObject
>(
    p: {
        body: {
            username: string,
            email: string,
            password: string,
            invitation_code: string,
            email_verification_token: string
        },
        query: any
    }
): 
    Promise<ApiResponse<ExpectedUserObject | null>>
{

    const res = await directusAPI({
        endPoint: '/users',
        method: 'POST',
        auth: 'app',
        body: {
            ...p.body,
            email_verified: false,
            status: 'unverified'
        },
        query: p.query
    })

    if(!res.data) {
        return handleNoDataError('No data returned in /users => createUser()')
    }

    return res
}

async function refreshTokens(
    refreshToken: string
): 
    Promise<ApiResponse<DirectusTokens | null>>
{
    const res: ApiResponse<any> = await directusAPI({  //should replace the "any" type
        endPoint: '/auth/refresh',
        method: 'POST',
        auth: 'public',
        body: {
            refresh_token: refreshToken,
            mode: 'json'
        }
    })

    if(!res.data) {
        return handleNoDataError('No data returned in /api/auth/refresh => refreshTokens()')
    }

    return res
}






