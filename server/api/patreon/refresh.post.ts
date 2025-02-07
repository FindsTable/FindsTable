export default defineEventHandler(async (event) => {

    const headers = getRequestHeaders(event);
    const match = headers.cookie?.match(/patreon_refresh_token=([^;]*)/);
    const refreshToken: string | undefined = match ? match[1] : undefined;

    if(!refreshToken) {
        return newResponse({
            ok: false,
            status: 401,
            statusText: 'Unauthorized'
        })
    }

    const newTokens = {
        data: {
            refresh_token: "",
            expires_in: 0
        }
    }

    const runtimeConfig = useRuntimeConfig()
    const tokens = await $fetch(
        'https://www.patreon.com/api/oauth2/token',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                client_id: `${runtimeConfig.public.PATREON_FINDSTABLENET_CLIENT_ID}`,
                client_secret: `${runtimeConfig.PATREON_FINDSTABLENET_CLIENT_SECRET}`,
                refresh_token: refreshToken
            }).toString()
        }
    )

    
    setCookie(
        event,
        'patreon_refresh_token',
        newTokens.data.refresh_token,
        {
            httpOnly: false,
            path: '/',
            maxAge: newTokens.data.expires_in,
            sameSite: 'strict',
            secure: true
        }
    )

    return tokens
})