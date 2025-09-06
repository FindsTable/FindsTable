export type {
    UserObject,
    DirectusTokens,
    ParsedAccessToken,
    RoleObject,
    AvatarObject,
    FollowObject,
    FileObject,
    DirectusPatreonAccountObject,
    ItemObject,
    BadgeObject,
    UserBadgeObject,
    UserContentObject,
    BadgeRecord,
    HuntReportObject
}

type ItemObject = 
    AvatarObject | 
    FollowObject |
    BadgeObject |
    DirectusPatreonAccountObject |
    UserContentObject


type UserObject = {
    id?: string
    email?: string
    username?: string
    email_verified?: boolean
    created_at?: number
    updated_at?: number 
    role?: string      
    is_active?: boolean
    first_name?: string
    last_name?: string
    patreon_account?: DirectusPatreonAccountObject | string
    count?: number
    [key: string]: any
};

type DirectusTokens = {
    access_token: string,
    refresh_token: string,
    expires: number
}

type ParsedAccessToken = {
    access_token: {
        value: string,
        expires_at: number
    }
}

type RoleObject = {
    id?: string,
    name?: string,
    icon?: string,
    description?: string,
    public?: boolean,
    parent?: RoleObject,
    children?: RoleObject[],
    users?: UserObject[] | string[]
}


type AvatarObject = {
    id: string
    user_created?: string
    date_created?: string
    user_updated?: string
    date_updated?: string
    image: string
    user?: string
    currentAt?: number
}

type FollowObject = {
    id?: number,
    user_created?: string | UserObject,
    date_created?: string,
    follower?: string | UserObject,
    followed?: string | UserObject,
    uniqueKey?: string,
    active?: boolean
}

type FileObject = {
    id?: string,
    storage?: string,
    filename_disk?: string,
    filename_download?: string,
    title?: string,
    type?: string,
    folder?: string,
    user?: string
}

/*
these fields are defined by 
the access policy of the user role in Directus
The client requests patreon_account.*, 
but gets only the allowed fields
*/
type DirectusPatreonAccountObject = {
    id?: string,
    user?: string,
    status?: string,
    access_token?: string,
    token_type?: string,
    refresh_token?: string,
    expires_at?: number
}

// /items/Badges
type BadgeObject = {
    key: string
    status: boolean
    sort?: any
    type: string
    level1: string | null
    level2: string | null
    level3: string | null
    level4: string | null
    translations: any
}

// /items/UserContent_badges
type UserBadgeObject = {
    id: string,
    level: "level1" | "level2" | "level3" | "level4",
    badge: string
    userContent: string
}

type BadgeRecord = {
    id: string
    firstBeliever: 0 | 1
    betaTester: 0 | 1
    goldDancer: 0 | 1
    patreonMember: 0 | 1 | 2 | 3
    numberOfActiveFinds: 0 | 1 | 2 | 3 | 4
    user: string
}

type UserContentObject = {
    id: string
    'avatars'?: AvatarObject[]
    'badges'?: BadgeObject[]
}

type HuntReportObject = {
    id: string
    title: string
    content: string
    biome: BiomeKey
    date: string
    bootyPhoto: string
}