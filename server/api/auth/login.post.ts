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

    // const emailVerified = await emailIsVerified(reqBody.email)
    // console.log('email verified ?', emailIsVerified)

    // if(!emailVerified) {
    //     return newResponse({
    //         ok: false,
    //         status: 400,
    //         statusText: 'Bad Request',
    //         feedback: {
    //             toaster: {
    //                 messagePath: 'error.auth.badCredentials',
    //                 type: 'error'
    //             }
    //         },
    //         data: null
    //     })
    // }

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
            secure: true
        }
    )

    setCookie(event, 'directus_session_token', res.data.access_token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/api/assets',
        maxAge: 3600,
    })

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

async function emailIsVerified(
    email: string
): 
    Promise<boolean>
{
    
    const res = await getUsersByQuery<{
        email_verified: boolean
    }> ({
        auth: 'app',
        query: {
            fields: 'email,email_verified',
            filter: {
                email: {
                    _eq: email
                }
            }
        }
    })

    if(!res.data) {
        return false
    }

    return res.data[0].email_verified
}