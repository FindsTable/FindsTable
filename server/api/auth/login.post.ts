import { readEvent } from '@@/server/apiUtils/readEvent'
import { loginWithEmailAndPassword } from '@@/server/directus/auth'

interface Body {
    email: string
    password: string
}

export default defineEventHandler(async (
    event
): 
    Promise<any> => 
{
    const body: Body = await readBody(event);

    body.email = body.email.trim().toLowerCase()
    assertEmailFormat(body.email)

    try{
        var res = await $fetch<{data: any}>(
            'https://admin.findstable.net/auth/login',
            {
                method: 'POST',
                body: {
                    email: body.email,
                    password: body.password
                }
            }
        )

        if(!res.data) throw new Error('Missing data from login response')
    } catch(err: any) {
        if(err.statusCode === 401) {
            throw toasterError({
                code: 401,
                message: 'Bad credentials',
                reason: 'Email or password is wrong',
                toasterPath: 'forms.userAccount.badCredentails'
            })
        }
        throw toasterError({
            code: 500,
            message: 'Server error',
            reason: 'Could not log in',
            toasterPath: 'errors.server.unknown'
        })
    }

    try {
        setCookie(
            event,
            'findstable_refresh_token',
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
        return {
            value: res.data.access_token,
            expires_at: Date.now() + res.data.expires
        }
    } catch(err) {
        throw err
    }
})
