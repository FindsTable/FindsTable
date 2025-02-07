export {
    DirectusCollection,
    Me
}

type DirectusCollection = 
    'Patreon_accounts' | 
    'Finds' | 
    'Invitation_codes' | 
    'Avatars' |
    string

type Patreon_accounts = {
    status: 'Active' | 'Disabled'
    id: string
    first_name?: string
    full_name?: string
    email: string
    url: string
    thumb_url?: string
    patron_status?: string | null
    tier?: string
    access_token: string
    expires_in: number
    token_type: string
    refresh_token: string
    user_created?: string
    date_created?: string
    user_updated?: string
    date_updated?: string
}

interface Me {
    id: string
    avatarFileId: string
    username: string
    email: string,
    patreon_account: string | PatreonAccountObject | null
}

interface PatreonAccountObject {
    id: string
    access_token: string
    expires_at: number
    token_type: string
    refresh_token: string
}