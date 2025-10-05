import { refreshTokens } from '@@/server/directus/auth'

export default defineEventHandler(async (
    event
):
    Promise<AccessToken> => 
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

        const tokens = await refreshTokens(refresh_token)

        setCookie(
            event,
            'findstable_refresh_token',
            tokens.refresh_token,
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
            tokens.access_token, 
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
            value: tokens.access_token,
            expires: Date.now() + tokens.expires
        }
    } catch(err) {
        throw err
    }
})