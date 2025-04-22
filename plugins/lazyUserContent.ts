export default defineNuxtPlugin((nuxtApp) => {

    nuxtApp.hooks.hook('app:mounted', async () => {
        if(useUserState().value.isLoggedIn) {
            await getContentFromUserObject()
            await loadAppContent()
        }
    });

});

async function loadAppContent() {
    const  {
        initiateAppContent
    } = useFTApp()
    
    await initiateAppContent()

    const {
        loadUserContent
    } = useHandleAppContent()

    await loadUserContent()
}

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
}

