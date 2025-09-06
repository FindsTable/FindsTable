export {
    useUpdateMe_user,
    useUpdateMe_recordValue,
    useDeleteMyAccount
}

function useUpdateMe_user(
    options: {
        body: any
        query? : any,
        onRequest?: () => any
        onResponse?: (res : any) => void
        onResponseError?: (res : any) => void
    }

) {
    const res = $fetch(
        '/api/me/update/user',
        {
            method: 'PATCH',
            headers: {
                authorization: `Bearer ${useUserState().value.accessToken.value}`
            },
            ...options
        }
    )

    return res
}
function useUpdateMe_recordValue(
    options: {
        body: any
        query? : any,
        onRequest?: () => any
        onResponse?: (res : any) => void
        onResponseError?: (res : any) => void
    }

) {
    const res = $fetch(
        '/api/me/update/record-value',
        {
            method: 'PATCH',
            headers: {
                authorization: `Bearer ${useUserState().value.accessToken.value}`
            },
            ...options
        }
    )

    return res
}

function useDeleteMyAccount(
    options: {
        body : {
            confirmation: string,
            username: string
        },
        onRequest?: () => any,
        onResponse?: (res : any) => void
        onResponseError?: (res : any) => void
    }
) {
    if(options.body.confirmation !== options.body.username) return

    const res = $fetch(
        '/api/me/update',
        {
            method: 'PATCH',
            headers: {
                authorization: `Bearer ${useUserState().value.accessToken.value}`
            },
            ...options
        }
    )

    return res
}