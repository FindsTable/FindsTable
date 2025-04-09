export {
    useUserContent,
    useGetUserContent
}

const useUserContent = () => {
    return useState<{
        avatars: any[]
        finds: any[]
        badges: any[]
        badgeRecord: undefined | BadgeRecord
        notifications: any[]
        fetched: {
            avatars: boolean
            finds: boolean
            badges: boolean
            badgeRecord: boolean,
            notifications: boolean
        }
    }>(
        'userContent',
        () => ({
            avatars: [],
            finds: [],
            badges: [],
            badgeRecord: undefined,
            notifications: [],
            fetched: {
                avatars: false,
                finds: false,
                badges: false,
                badgeRecord: false,
                notifications: false
            }
        })
    );
}


const requestFields : {
    [key: string]: string[]
} = {
    notifications: [
        'id',
        'user_for.username',
        'user_from.username',
        'action.*',
        'content.*'
    ]
}


async function useGetUserContent(
    collection : string
) {
    type UserContentKey = 'avatars' | 'finds' | 'badges' | 'badgeRecord' | 'notifications';
    const key = collection.toLowerCase() as UserContentKey;

    const query = {
        fields: requestFields[collection.toLowerCase()]!.join(','),
        filter: {}
    }

    if (key === "notifications") {

        const lastNotifCheck = localStorage.getItem(`last_notif_check_${useUserState().value.id}`) || "2025-01-01T00:00:00.000Z"

        console.log(lastNotifCheck)
        query.filter = {
            date_created: {
                _gt: lastNotifCheck
            }
        }
    }

    const userContent = useUserContent()
    const res = await useGetItems({
        collection: collection,
        query: query
    })

    if(res) {
        userContent.value[key] = res
        userContent.value.fetched[key] = true
    }

}