import { refreshTokens } from '@/server/directus/auth'

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
            httpOnly: false,
            path: '/',
            maxAge: res.data.expires,
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
    });

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