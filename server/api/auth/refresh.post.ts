import { refreshTokens } from '@@/server/directus/auth'

export default defineEventHandler(async (
    event
):
    Promise<ApiResponse<ParsedAccessToken | null>> => 
{

    const refresh_token = getCookie(
        event, 
        'directus_refresh_token'
    )

    if (!refresh_token) {
        return {
            ok: false,
            status: 403,
            statusText: 'no refresh token'
        }
    }
    
    const res = await refreshTokens(refresh_token)

    if(!res.data) {
        return {
            ok: false,
            status: 500,
            statusText: 'Sorry, we could not refresh your session'
        }
    }

    setCookie(
        event,
        'directus_refresh_token',
        res.data.refresh_token,
        {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            path: '/',
            maxAge: 604800, // 7 days, this value is set in Directus config : REFRESH_TOKEN_TTL
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
    // return an object to match the expected type of userState.accessToken

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