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
            method: 'POST',
            headers: {
                authorization: `Bearer ${useUserState().value.accessToken.value}`
            },
            body: p.query
        }
    )

    return res.data

}

interface DirectusRes {
    data: any
}