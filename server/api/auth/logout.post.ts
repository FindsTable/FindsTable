import { newResponse, ApiResponse } from '#shared/types/apiResponse'

export default defineEventHandler(async (
    event
): 
    Promise<ApiResponse<undefined>> => 
{
    
    const refresh_token = getCookie(
        event, 'findstable_refresh_token'
    )

    if (!refresh_token) {
        return newResponse({
            ok: false,
            status: 401,
            statusText: 'Unauthorized',
            feedback: {
                toaster: {
                    messagePath: 'error.auth.logout.missingRefreshToken',
                    type: 'success'
                }
            }
        })
    }
    
    try {
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
                expires: new Date(0)
            }
        )
        setCookie(
            event, 
            'directus_session_token', 
            '', 
            {
                expires: new Date(0)
            }
        )
        return newResponse({
            ok: true,
            status: 200,
            statusText: 'ok',
            feedback: {
                toaster: {
                    messagePath: 'success.auth.logout',
                    type: 'error'
                }
            }
        })

    } catch (error) {
        return newResponse({
            ok: false,
            status: 500,
            statusText: 'Logout failled',
            feedback: {
                toaster: {
                    message: 'Could not logout',
                    type: 'error'
                }
            }
        })
    }
})