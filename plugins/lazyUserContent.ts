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

    if(useUserState().value?.patreon_account?.access_token !== undefined) {
        const patreonMe = await useNuxtApp().$patreon.getMe(useUserState().value.patreon_account.access_token)
    }
    
    if(!userContent.value.fetched.finds) {

    }

    if(!userContent.value.fetched.avatars) {

        const res = await useNuxtApp().$items.getByQuery<any>({
            collection: 'Avatars',
            query: {
                fields: '*',
                filter: {
                    user: {
                        _eq: useUserState().value.id
                    }
                },
                sort: '-currentAt'
            }
        })

        if(res?.data && res.data) {
            userContent.value.avatars = res.data
            userContent.value.fetched.avatars = true
        }
    }
    if(!userContent.value.badgeRecord) {
        await refreshBadgeRecord()
    }
}

async function refreshBadgeRecord() {
    const userContent = useUserContent()
    const res = await useNuxtApp().$items.getByQuery<BadgeRecord>({
        collection: 'Badge_records',
        query: {
            filter: {
                user: {
                    _eq: useUserState().value.id
                },
            },
            fields: '*,slot1.*,slot2.*,slot3.*'
        }
    })

    if(res?.data && res.data[0]) {
        userContent.value.badgeRecord = res.data[0]
    }
}