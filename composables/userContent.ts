export {
    useUserContent,
    useHandleAppContent
}

export type {
    UserBadge
}

const useUserContent = () => {
    return useState<{
        avatars: any[]
        finds: any[]
        badges: UserBadge[]
        badgeRecord: undefined | BadgeRecord
        bookmarks: any[]
        fetched: {
            avatars: boolean
            finds: boolean
            badges: boolean
            badgeRecord: boolean
            bookmarks: boolean
        }
    }>(
        'userContent',
        () => ({
            avatars: [],
            finds: [],
            badges: [],
            badgeRecord: undefined,
            bookmarks: [],
            fetched: {
                avatars: false,
                finds: false,
                badges: false,
                badgeRecord: false,
                bookmarks: false
            }
        })
    );
}

function useHandleAppContent() {

    const {
        directFetch
    } = useDirectAsyncFetch()

    const collections : CollectionsMeta = {
        badges: {
            name: "User_badges",
            fetOptions: {
                query: {
                    fields: [
                        'id','owner','badge', 'level.*'
                    ].join(','),
                    filter: {
                        owner: {
                            _eq: useUserState().value.id
                        }
                    }
                }
            }
        },
        badgeRecord: {
            name: 'Badge_records',
            fetOptions: {
                singleItem: true,
                query: {
                    fields: [
                        '*'
                    ].join(','),
                    filter: {
                        owner: {
                            _eq: useUserState().value.id
                        }
                    }
                }
            }
        }
    }
    async function getCollectionData(key : CollectionKey) {
        const {
            response
        } = await directFetch<UserBadge>(
            'GET', `/items/${collections[key].name}`,
            collections[key].fetOptions
        )

        if(response) {
            const userContent = useUserContent()
            userContent.value[key] = response
        }
    }

    async function refreshCollection(key : CollectionKey) {
        await getCollectionData(key)
    }

    async function loadUserContent() {
        await getCollectionData('badges')
        await getCollectionData('badges')
    }

    return {
        loadUserContent,
        refreshCollection
    }
}


type CollectionName = 'User_badges' | 'Badge_records'

type CollectionKey = 'badges' | 'badgeRecord'

type CollectionsMeta = {
    [key in CollectionKey]: {
        name: CollectionName,
        fetOptions: FetchOptions
    }
}
type Query = {
    fields?: string
    filter?: Record<string, any>
    sort?: string
}
type FetchOptions = {
    query?: Query
    singleItem?: boolean
}
type UserBadge = {
    id: string,
    badge: string,
    owner: string,
}