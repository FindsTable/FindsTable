export {
    useGetItems
}

async function useGetItems(p : {
    collection: string,
    query: {
        [key : string] : any
    }
}) {

    const res : DirectusRes = await $fetch(
        `${useAppConfig().directusUrl}/items/${p.collection}`,
        {
            method: 'GET',
            headers: {
                authorization: `Bearer ${useUserState().value.accessToken.value}`
            },
            query: p.query
        }
    )

    return res.data

}

interface DirectusRes {
    data: any
}

