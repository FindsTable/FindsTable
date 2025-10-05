import { directusAPI } from "./main"
import { ApiResponse } from '#shared/types/apiResponse'

export {
    refreshTokens
}

async function refreshTokens(
    refreshToken: string
): Promise<DirectusTokens> {

    // const res: ApiResponse<any> = await directusAPI({  //should replace the "any" type
    //     endPoint: '/auth/refresh',
    //     method: 'POST',
    //     auth: 'public',
    //     body: {
    //         refresh_token: refreshToken,
    //         mode: 'json'
    //     }
    // })

    // return res.data

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






