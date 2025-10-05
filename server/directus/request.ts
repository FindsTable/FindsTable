export {
    appGet,
    appPost,
    appPatch,
    appDelete,
    userPatch,
    userPost
}

async function appGet<Expected>(p : {
    endpoint: string
    query?: any
}) : Promise<Expected> {
    // console.log('appGet params', `Bearer ${useRuntimeConfig().APP_ACCESS_TOKEN}`)

    var res = await appFetch<Expected>({
        endpoint: p.endpoint,
        method: 'GET',
        query: p.query
    })

    return res.data
}

async function appPost<Expected>(p : {
    endpoint: string
    body?: any
    query?: any
}) : Promise<Expected> {
    console.log('appPost', p)

    const res = await appFetch<Expected>({
        endpoint: p.endpoint,
        method: 'POST',
        body: p.body,
        query: p.query
    })

    return res.data
}

async function appPatch<Expected>(p : {
    endpointId: string
    body?: any
    query?: any
}) : Promise<Expected> {
    console.log('appFetch', {
        endpoint: p.endpointId,
        method: 'PATCH',
        body: p.body,
        query: p.query
    })

    const res = await appFetch<Expected>({
        endpoint: p.endpointId,
        method: 'PATCH',
        body: p.body,
        query: p.query
    })

    return res.data
}

async function appDelete(p : {
    endpoint: string
    body?: any
}) {

    await appFetch({
        endpoint: p.endpoint,
        method: 'POST',
        body: p.body
    })
}

async function appFetch<Expected>(p: {
  endpoint: string,
  method: "GET" | "POST" | "PATCH" | "DELETE",
  body?: any,
  query?: any
  throw?: boolean
}): Promise<{ data: Expected }> {
    try {
        const res = await $fetch<{ data: Expected }>(
        `${useRuntimeConfig().DIRECTUS_URL}${p.endpoint}`,
        {
            method: p.method,
            headers: {
            authorization: `Bearer ${useRuntimeConfig().APP_ACCESS_TOKEN}`
            },
            query: p.query,
            body: p.body
        }
        );

        return res;
    } catch (err: any) {
        // Determine status code from Directus error response or fallback
        const code = err.response?.status ?? err.statusCode ?? 500;
        const message = err.response?.statusText ?? err.message ?? 'Unknown error';

        // Authorization errors
        if (code === 401 || code === 403) {
        throw newError({
            code: 403,
            message: 'Forbidden',
            reason: 'User is not allowed to perform this action'
        });
        }

        // Other errors
        throw newError({
        code,
        message,
        reason: 'Something went wrong while fetching data from Directus'
        });
    }
}

async function userPatch<Expected>(p : {
    endpoint: string,
    bearerToken: string,
    body? : any,
    query? : any
}) : Promise<Expected> {

    const res = await userFetch({
        endpoint: p.endpoint,
        method: 'PATCH',
        bearerToken: p.bearerToken,
        body: p.body,
        query: p.query
    })

    return res.data
}
async function userPost<Expected>(p : {
    endpoint: string,
    bearerToken: string,
    body? : any,
    query? : any
}) : Promise<Expected> {

    const res = await userFetch({
        endpoint: p.endpoint,
        method: 'POST',
        bearerToken: p.bearerToken,
        body: p.body,
        query: p.query
    })

    return res.data
}

async function userPost<Expected>(p : {
    endpoint: string,
    bearerToken: string,
    body? : any,
    query? : any
}) : Promise<Expected> {

    const res = await userFetch({
        endpoint: p.endpoint,
        method: 'POST',
        bearerToken: p.bearerToken,
        body: p.body,
        query: p.query
    })

    return res.data
}

async function userFetch<Expected>(p : {
    endpoint: string,
    method : 'GET' | 'POST' | 'PATCH' | 'DELETE'
    bearerToken: string,
    body? : any,
    query? : any
}) : Promise<any> {
    try {
        const res = await $fetch<{ data: Expected }>(
        `${useRuntimeConfig().DIRECTUS_URL}${p.endpoint}`,
        {
            method: p.method,
            headers: {
                authorization: p.bearerToken
            },
            query: p.query,
            body: p.body
        }
        );

        return res;
    } catch (err: any) {
        throw err
        // Determine status code from Directus error response or fallback
        const code = err.response?.status ?? err.statusCode ?? 500;
        const message = err.response?.statusText ?? err.message ?? 'Unknown error';

        // Authorization errors
        if (code === 401 || code === 403) {
            throw newError({
                code: 403,
                message: 'Forbidden',
                reason: 'User is not allowed to perform this action'
            });
        }

        // Other errors
        throw newError({
            code,
            message,
            reason: 'Something went wrong while fetching data from Directus'
        });
    }

}