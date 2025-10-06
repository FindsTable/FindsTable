export {
    useUserContent,
    useHandleUserContent,
    useMyBadgeRecord
}

type UserContent = {
    avatars: Avatar[]
    finds: Find[]
    badges: any[]
    successBadges: any[]
    badgeRecord: any
    bookmarks: Bookmark[]
    fetched: {
        avatars: boolean
        finds: boolean
        badges: boolean
        badgeRecord: boolean
        bookmarks: boolean
    }
}

const useMyBadgeRecord = () => {
    return useState<BadgeRecord | null>(
        'userContent',
        () => (null)
    );
}

const useUserContent = () => {
    return useState<UserContent>(
        'userContent',
        () => ({
            avatars: [],
            finds: [],
            badges: [],
            successBadges: [],
            badgeRecord: null,
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

function useHandleUserContent() {

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
                    },
                    limit: 1
                }
            }
        }
    }

    async function getCollectionData<Expected>(key : CollectionKey) {
        const {
            response
        } = await directFetch<Expected>(
            'GET', `/items/${collections[key].name}`,
            collections[key].fetOptions
        )

        if(response) {
            const userContent = useUserContent()
            if(key === 'badges') {
                userContent.value.badges = response as UserContent['badges']
                return
            }
            if(key === 'badgeRecord') {
                userContent.value.badgeRecord = response as BadgeRecord
            }
        }
    }

    async function refreshCollection(key : CollectionKey) {
        await getCollectionData(key)
    }

    async function loadUserContent() {
        await getCollectionData<UserContent['badges']>('badges')
        await getCollectionData<UserContent['badgeRecord']>('badgeRecord')
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
    sort?: string,
    limit?: number
}
type FetchOptions = {
    query?: Query
    singleItem?: boolean
}
