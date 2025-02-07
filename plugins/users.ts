import type { ParsedApiResponse } from '#imports'

export default defineNuxtPlugin(() => {
    return {
        provide: {
            users: {
                getMe,
                updateMe,
                getByQuery,
                getById
            }
        },
    }
})

async function getMe<
ExpectedUserObject extends UserObject
>(
    query: any
): 
    Promise<ParsedApiResponse<ExpectedUserObject | null>>
{
    const res = await use$Fetch<ExpectedUserObject>(
        '/api/users/me',
        {
            method: 'GET',
            headers: {
                'authorization': `Bearer ${useUserState().value.accessToken.value}`,
            },
            query: query
        }
    )

    return useParseApiResponse<ExpectedUserObject>(res)
}

async function updateMe<
    ExpectedUserObject extends UserObject
>(
    p: {
        body: any,
        query: any
    }
): Promise<ParsedApiResponse<ExpectedUserObject | null>> {

    const res = await use$Fetch<ExpectedUserObject>(
        '/api/users/me',
        {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${useUserState().value.accessToken.value}`
            },
            ...p
        }
    )

    return useParseApiResponse<ExpectedUserObject>(res)
}

async function getByQuery<
    ExpectedUserObject extends UserObject
>(
    query: any
): 
    Promise<ParsedApiResponse<ExpectedUserObject[] | null>>
{
    const res = await use$Fetch<ExpectedUserObject>(
        '/api/users/getByQuery',
        {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${useUserState().value.accessToken.value}`
            },
            query
        }
    )
    
    return useParseApiResponse<ExpectedUserObject[]>(res)
}

async function getById<
    ExpectedUserObject extends UserObject
>(
    p: {
        id: string,
        query: any
    }
): Promise<ParsedApiResponse<ExpectedUserObject | null>> {
    const res = await use$Fetch<ExpectedUserObject>(
        `/api/users/${p.id}`,
        {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${useUserState().value.accessToken.value}`
            },
            query: p.query ? p.query : { fields: '*' }
        }
    )

    return useParseApiResponse<ExpectedUserObject>(res)
}