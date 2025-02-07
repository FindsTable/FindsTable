export type {
    PatreonUser,
    PatreonAuthorization,
    UserState_Patreon
}

interface PatreonUser {
    id: string
    email: string
    first_name: string
    full_name: string
    url: string
    thumb_url?: string
    patron_status: string
    tier: string
}

interface PatreonAuthorization {
    access_token: string
    expires_at: number
    token_type: string
    refresh_token: string
    scope?: string //unused in the app
}

interface UserState_Patreon {
    id: string
    first_name: string
    full_name: string
    email: string
    thumb_url: string
    url: string
    tier: string
    patron_status: string
    access_token?: string
    expires_at?: 0,
    token_type?: string
    refresh_token?: string
}