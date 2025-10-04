import { refreshTokens } from '@@/server/directus/auth'

export default defineEventHandler(async (
    event
):
    Promise<any> => 
{
    try {
        const refresh_token = getCookie(
            event, 
            'findstable_refresh_token'
        )
        if(!refresh_token) throw newError({
            code: 403,
            message: 'Unauthorized',
            reason: 'No refresh token for refresh'
        })

        const res = await refreshTokens(refresh_token)
        if(!res.data) throw newError({
            code: 403,
            message: 'Unauthorized',
            reason: 'Tried to refresh, but with no success'
        })

        setCookie(
            event,
            'findstable_refresh_token',
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
        return {
            value: res.data.access_token,
            expires_at: Date.now() + res.data.expires
        }
    } catch(err) {
        throw err
    }
})