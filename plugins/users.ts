import type { ParsedApiResponse } from '#imports'

export default defineNuxtPlugin(() => {
    return {
        provide: {
            users: {
                updateMe,
                deleteById
            }
        },
    }
})

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

async function deleteById(p: {
    id: String
    username: String
    confirmation: String
}) {

    const res = await use$Fetch<null>(
        `/api/users/${p.id}`,
        {
            method: 'DELETE',
            headers: {
                authorization: `Bearer ${useUserState().value.accessToken.value}`
            },
            body: {
                username: p.username,
                confirmation: p.confirmation
            }
        }
    )
    
    return res
}