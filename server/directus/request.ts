export {
    appGet,
    appPost,
    appPatch,
    appDelete
}

async function appGet<Expected>(p : {
    endpoint: string
    query?: any
}) : Promise<Expected> {
    console.log('appGet params', p)

    const res = await appFetch<Expected>({
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

async function appFetch<Expected>(p : {
    endpoint: string,
    method: "GET" | "POST" | "PATCH" | "DELETE",
    body?: any,
    query?: any
}) : Promise<{data: Expected}> {

    if(p.method === "GET") {
        console.log(
            "appFetch GET", 
            `${useRuntimeConfig().DIRECTUS_URL}${p.endpoint}`,
            {
                method: p.method,
                headers: {
                    authoriezation: `Bearer ${useRuntimeConfig().APP_ACCESS_TOKEN}`
                },
                query: p.query,
                body: p.body
            }
        )
    }

    if(p.method === "POST") {
        console.log(
            "appFetch POST", 
            `${useRuntimeConfig().DIRECTUS_URL}${p.endpoint}`,
            {
                method: p.method,
                headers: {
                    authoriezation: `Bearer ${useRuntimeConfig().APP_ACCESS_TOKEN}`
                },
                query: p.query,
                body: p.body
            }
        )
    }

    var res = await $fetch<{data: Expected}>(
        `${useRuntimeConfig().DIRECTUS_URL}${p.endpoint}`,
        {
            method: p.method,
            headers: {
                authoriezation: `Bearer ${useRuntimeConfig().APP_ACCESS_TOKEN}`
            },
            query: p.query,
            body: p.body
        }
    )

    return res
}


