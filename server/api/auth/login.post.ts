import { readEvent } from '@/server/apiUtils/readEvent'
import { getUsersByQuery } from '@/server/directus/users'
import { loginWithEmailAndPassword } from '@/server/directus/auth'

export default defineEventHandler(async (
    event
): 
    Promise<ApiResponse<ParsedAccessToken | null>> => 
{

    const {
        body : reqBody,
        error
    } = await readEvent(event, [ 'body' ])

    if (error) return error

    reqBody.email = reqBody.email.trim().toLowerCase()

    const userValidation = await userValidationBeforeLogin(reqBody.email)

    if( userValidation === undefined ) {
        return newResponse({
            ok: false,
            status: 400,
            statusText: 'Bad Request',
            feedback: {
                toaster: {
                    messagePath: 'error.global.unexpected',
                    type: 'error'
                }
            },
            data: null
        })
    }

    if( userValidation.userExists === false ) {
        return newResponse({
            ok: false,
            status: 401,
            statusText: 'Unauthorized',
            feedback: {
                toaster: {
                    messagePath: 'error.auth.invalidCredentials',
                    type: 'error'
                }
            },
            data: null
        })
    }

    if( userValidation.status !== 'active') {
        return newResponse({
            ok: false,
            status: 401,
            statusText: 'Unauthorized',
            feedback: {
                toaster: {
                    messagePath: 'error.auth.invalidCredentials',
                    type: 'error'
                }
            },
            data: null
        })
    } 

    if( userValidation.email_verified !== true) {
        return newResponse({
            ok: false,
            status: 401,
            statusText: 'Unauthorized',
            feedback: {
                toaster: {
                    messagePath: 'error.auth.emailNotVerified',
                    type: 'error'
                }
            },
            data: null
        })
    }

    const res = await loginWithEmailAndPassword(reqBody.email, reqBody.password)
    
    if(!res.data) {
        return res
    }
    
    setCookie(
        event,
        'directus_refresh_token',
        res.data.refresh_token,
        {
            httpOnly: true,
            path: '/',
            maxAge: 604800, // 7 days, this value is set in Directus config : REFRESH_TOKEN_TTL
            sameSite: 'strict',
            secure: true,
            domain: '.findstable.net'
        }
    )
    setCookie(
        event, 
        'directus_session_token', 
        res.data.access_token, 
        {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            path: '/',
            maxAge: 3600,
            domain: '.findstable.net'
        }
    )
    
    return newResponse({
        ok: true,
        status: 200,
        statusText: 'OK',
        data: {
            access_token: {
                value: res.data.access_token,
                expires_at: Date.now() + res.data.expires
            }
        }
    })
})
type userValidationResponse = {
    userExists: Boolean
    status: String
    email_verified: Boolean
} | undefined

async function userValidationBeforeLogin(
    email: string
) {
    // Verify that user with this email address exists
    // Check if email was verified
    // Check status === active

    const runtimeConfig = useRuntimeConfig()

    const res : userValidationResponse = {
        userExists: false,
        status: 'notRegistered',
        email_verified: false
    }

    const user = await $fetch<any>(
        'https://admin.findstable.net/users',
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${runtimeConfig.APP_ACCESS_TOKEN}`
            },
            query: {
                fields: 'email,email_verified,status',
                filter: {
                    email: {
                        _eq: email
                    }
                },
                limit: '1'
            }
        }
    )

    if(!user.data || !user.data.length) {
        return res
    }

    const userData = user.data[0]

    res.status = userData.status
    res.email_verified = userData.email_verified
    res.userExists = userData.email === email
    console.log('user verification:', res)

    return res
}