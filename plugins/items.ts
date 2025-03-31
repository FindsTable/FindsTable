import type { ParsedApiResponse } from '@/composables/apiResponse'

export default defineNuxtPlugin(() => {
    return {
        provide: {
            items: {
                directGetByQuery,
                create,
                update,
                getByQuery,
                getById,
                deleteById
            }
        }
    }
})

async function directGetByQuery<
    Data extends ItemObject
>(
    p: {
        collection: string,
        query: any
    }
):
    Promise<ParsedApiResponse<Data[] | null>>
{
    try {
        const res = await $fetch<ApiResponse<any>>(
            `https://admin.findstable.net/items/${p.collection}`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${useUserState().value.accessToken.value}`
                },
                query: p.query
            }
        )

        if(res?.data) {
            return {
                ok: true,
                data: res.data,
                toaster: null
            }
        }
        
    } catch(e) {
        return {
            ok: false,
            data: null,
            error: e,
            toaster: {
                id: "fetchError",
                message: "We could not fetch your data",
                type: "error",
                autoClose: true,
                position: "bottom"
            }
        }
    }
    return {
        ok: false,
        data: null,
        toaster: null
    }
}

async function create<
    Data extends ItemObject
> (
    p: {
    collection: string
    body: any
    query?: any
}): 
    Promise<ParsedApiResponse<Data | null>> 
{
    const res = await $fetch<ApiResponse<Data>>(
        `/api/items/${p.collection}/create`,
        {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${useUserState().value.accessToken.value}`
            },
            body: p.body,
            query: p.query ? p.query : {}
        }
    )

    return useParseApiResponse<Data>(res)
}

async function update<
    Data extends ItemObject
>(
    p: {
        collection: string,
        id: string,
        body: any,
        query?: any
    }
): 
    Promise<ParsedApiResponse<Data | null>>
{
    const res = await $fetch<ApiResponse<Data>>(
        `/api/items/${p.collection}/${p.id}/update`,
        {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${useUserState().value.accessToken.value}`
            },
            body: p.body,
            query: p.query ? p.query : {}
        }
    )

    return useParseApiResponse<Data>(res)
}

async function getByQuery<
    Data extends ItemObject
>(
    p: {
        collection: string,
        query: any
    }
):
    Promise<ParsedApiResponse<Data[] | null>>
{
    const res = await $fetch<ApiResponse<Data>>(
        `/api/items/${p.collection}/get`,
        {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${useUserState().value.accessToken.value}`
            },
            query: p.query
        }
    )

    return useParseApiResponse(res)
}

async function getById<
    Data extends ItemObject
>( 
    p: {
        collection: string,
        id: string,
        query: any
    }
):
    Promise<ParsedApiResponse<Data | null>>
{

    const res = await $fetch<ApiResponse<Data>>(
        `/api/items/${p.collection}/${p.id}/get`,
        {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${useUserState().value.accessToken.value}`
            },
            query: p.query
        }
    )
    return useParseApiResponse(res)
}

async function deleteById<Data>(
    p: {
        collection: String,
        id: String
    }
):
    Promise<ParsedApiResponse<Data | null>>
{

    const res = await $fetch<ApiResponse<Data>>(
        `/api/items/${p.collection}/${p.id}/delete`,
        {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${useUserState().value.accessToken.value}`
            }
        }
    )

    return useParseApiResponse(res)
}