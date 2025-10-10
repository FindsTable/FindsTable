
export {
    refreshTokens
}

async function refreshTokens(
    refreshToken: string
): Promise<DirectusTokens> {

    try {
        const { data : res } = await $fetch<{
            data:DirectusTokens
        }>(
            `${useRuntimeConfig().DIRECTUS_URL}/auth/refresh`,
            {
                method: 'POST',
                body: {
                    refresh_token: refreshToken,
                    mode: 'json'
                }
            }
        )

        return res
    } catch(err) {
        throw err
    }
}






