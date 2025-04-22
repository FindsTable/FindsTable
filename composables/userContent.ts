export {
    useUserContent,
    useGetUserContent
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

async function useGetUserContent() {

    const fetchOptions : FetchOptions = {
        User_badges: {
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
        },
        Badge_records: {
            singleItem: true,
            query: {
                fields: [
                    '*'
                ].join(','),
                filter: {
                    user: {
                        _eq: useUserState().value.id
                    }
                }
            }
        }
    }
    const collections : UserContentCollections = [
        { name: 'User_badges', key: 'badges'},
        { name: 'Badge_records', key: 'badgeRecord' },
    ]

    const {
        directFetch
    } = useDirectAsyncFetch()

    for(let collection of collections) {
        
        const {
            response
        } = await directFetch<UserBadge>(
            'GET', `/items/${collection.name}`,
            fetchOptions[collection.name]
        )

        if(response) {
            const userContent = useUserContent()
            userContent.value[collection.key] = response
        }
    }
}


type UserContentCollection = 'User_badges' | 'Badge_records'
type UserContentKey = 'badges' | 'badgeRecord'
type UserContentCollections = {
    name: UserContentCollection
    key: UserContentKey
}[]

type Query = {
    fields?: string
    filter?: Record<string, any>
    sort?: string
}
type FetchOptions = {
    [key in UserContentCollection]?: {
        query?: Query
        singleItem?: boolean
    }
}


type UserBadge = {
    id: string,
    badge: string,
    owner: string,
}