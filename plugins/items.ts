import type { ParsedApiResponse } from '@/composables/apiResponse'

export default defineNuxtPlugin(() => {
    return {
        provide: {
            items: {
                create,
                update,
                getByQuery,
                getById,
                deleteById
            }
        }
    }
})

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