import { newResponse, ApiResponse } from '#shared/types/apiResponse'

export default defineEventHandler(async (
    event
): 
    Promise<void> => 
{
    
    const refresh_token = getCookie(
        event, 'findstable_refresh_token'
    )

    if (!refresh_token) throw newError({
        code: 400,
        message: 'Bad request',
        reason: 'No refresh token cookie'
    })

    await $fetch(
        'https://admin.findstable.net/auth/logout',
        {
            method: 'POST',
            body: {
                refresh_token: refresh_token,
                mode: 'json'
            }
        }
    )

    setCookie(
        event,
        'findstable_refresh_token',
        '',
        {

            httpOnly: true,
            path: '/',
            maxAge: 0, // 7 days, this value is set in Directus config : REFRESH_TOKEN_TTL
            sameSite: 'strict',
            secure: true,
            domain: '.findstable.net'
        }
    )

    setCookie(
        event, 
        'directus_session_token', 
        '', 
        {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            path: '/',
            maxAge: 0,
            domain: '.findstable.net'
        }
    )
})