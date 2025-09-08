import { newResponse, ApiResponse } from '#shared/types/apiResponse'

export default defineEventHandler(async (
    event
): 
    Promise<ApiResponse<{cookies: Record<string, boolean>}>> => 
{
    // Set cookie for domain with dot
    setCookie(
        event,
        'server_test_dot',
        'test_value',
        {
            httpOnly: false,
            secure: true,
            sameSite: 'lax',
            path: '/',
            maxAge: 60,
            domain: '.findstable.net'
        }
    )

    // Set cookie for domain without dot
    setCookie(
        event,
        'server_test_nodot',
        'test_value',
        {
            httpOnly: false,
            secure: true,
            sameSite: 'lax',
            path: '/',
            maxAge: 60,
            domain: 'findstable.net'
        }
    )

    // Check if cookies were set successfully
    const dotCookie = getCookie(event, 'server_test_dot')
    const noDotCookie = getCookie(event, 'server_test_nodot')

    return newResponse({
        ok: true,
        status: 200,
        statusText: 'Test cookies created',
        data: {
            cookies: {
                server_dot: dotCookie === 'test_value',
                server_nodot: noDotCookie === 'test_value'
            }
        }
    })
})
