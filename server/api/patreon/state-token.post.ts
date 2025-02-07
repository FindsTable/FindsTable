import crypto from 'crypto';

export default defineEventHandler(async (event) => {

    const runtimeConfig = useRuntimeConfig();
    const appAccessToken = runtimeConfig.APP_ACCESS_TOKEN

    const headers = getRequestHeaders(event);
    const userAccesstoken = headers['authorization']?.split('Bearer ')[1];

    const { data: user } = await $fetch(
        `${runtimeConfig.DIRECTUS_URL}/users/me?fields=id`,
        {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${userAccesstoken}`
            }
        }
    )

    if (!user) {
        console.log('user not found when generating state token')
        return {
            ok: false,
            status: 401,
            statusText: 'Unauthorized'
        }
    }

    const body = await readBody(event);

    //compare userId from request to userId from directus
    if (user.id !== body.userId) {
        console.log('user mismatch when generating state token')
        return {
            ok: false,
            status: 401,
            statusText: 'Unauthorized'
        }
    }

    if (body.newStateToken) {
        const stateToken = crypto.randomBytes(16).toString('hex')

        //store token in user's profile in DIrectus
        const { data: res } = await $fetch(
            `${runtimeConfig.DIRECTUS_URL}/users/${body.userId}`,
            {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${appAccessToken}`
                },
                body: {
                    patreon_stateToken: stateToken
                }
            }
        )

        return {
            ok: true,
            status: 200,
            statusText: 'OK',
            token: res.patreon_stateToken
        }
    }

    if (body.validateStateToken) {

        const stateTokenPatreon = body.patreonStateToken

        const { data } = await $fetch(
            `${runtimeConfig.DIRECTUS_URL}/users/${body.userId}?fields=patreon_stateToken`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${appAccessToken}`
                }
            }
        )

        if (stateTokenPatreon === data.patreon_stateToken) {
            return {
                ok: true,
                status: 200,
                statusText: 'Token is valid',
                tokenIsValid: true
            }
        } else {
            console.log("token NOT identical")
            return {
                ok: false,
                status: 400,
                statusText: 'Token invalid',
                tokenIsValid: false
            }
        }
    }
})