export default defineNuxtPlugin((nuxtApp) => {

    nuxtApp.hooks.hook('app:mounted', async () => {
        if(useUserState().value.isLoggedIn) {
            await getContentFromUserObject()
        }
        
    });

    return {
        provide: {
            content: {
                refreshBadgeRecord
            }
        }
    }
});

async function getContentFromUserObject() {
    const userContent = useUserContent()

    if(!userContent.value.fetched.bookmarks) {

        const {
            differedFetch : getBookmarks
        } = useDirectAsyncFetch(
            'GET', '/items/Bookmarks',
            {
                differed: true,
                query: {
                    filter: {
                        user_created: {
                            _eq: useUserState().value.id
                        }
                    }
                }
            }
        )
        const bookmarks = await getBookmarks()

        userContent.value.bookmarks = bookmarks
        userContent.value.fetched.bookmarks = true
    }

    if(!userContent.value.fetched.avatars) {

        const {
            differedFetch : getAvatars
        } = useDirectAsyncFetch(
            'GET', '/items/Avatars',
            {
                differed: true,
                query: {
                    fields: '*',
                    filter: {
                        owner: {
                            _eq: useUserState().value.id
                        }
                    },
                    sort: '-currentAt'
                }
            }
        )

        const avatars = await getAvatars()

        if(avatars) {
            userContent.value.avatars = avatars
            userContent.value.fetched.avatars = true
        }
    }
    if(!userContent.value.badgeRecord) {
        await refreshBadgeRecord()
    }
}

async function refreshBadgeRecord() {
    const userContent = useUserContent()

    const {
        differedFetch : getBadgeRecord
    } = useDirectAsyncFetch(
        'GET', '/items/Badge_records',
        {
            differed: true,
            query: {
                filter: {
                    user: {
                        _eq: useUserState().value.id
                    },
                },
                fields: '*,slot1.*,slot2.*,slot3.*'
            }
        }
    )

    const record = await getBadgeRecord()

    if(record) {
        userContent.value.badgeRecord = record
    }
}