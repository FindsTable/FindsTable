export default defineNuxtPlugin(() => {
    return {
        provide: {
            files: {
                deleteById
            }
        },
    }
})

async function deleteById(id: string) {

    /*
        When deleting files, Directus will automatically delete the item associated to it
    */
    const res = await use$Fetch(
        `/api/files/${id}`,
        {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${useUserState().value.accessToken.value}`
            }
        }
    )

    return useParseApiResponse(res)
}