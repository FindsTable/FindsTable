export default defineNuxtPlugin(() => {
    return {
        provide: {
            social: {
                follow: {
                    start: startFollowing,
                    stop: stopFollowing
                }
            }
        },
    }
})

async function startFollowing(followedId: string) {

    const res = await use$Fetch(
        '/api/activity/social/follow',
        {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${useUserState().value.accessToken.value}`
            },
            body: {
                followedId: followedId
            }
        }
    )
    return useParseApiResponse(res)
}

async function stopFollowing(followId: string) {

    const res = await use$Fetch(
        '/api/activity/social/stop-following',
        {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${useUserState().value.accessToken.value}`
            },
            body: {
                followId: followId
            }
        }
    )

    return useParseApiResponse(res)
}