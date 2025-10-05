export type {
    PatreonAuthorization,
    FT_patreon_account
}

interface PatreonAuthorization {
    access_token: string
    expires_at: number
    token_type: string
    refresh_token: string
    scope?: string //unused in the app
}

interface FT_patreon_account {
    status: 'active' | 'disabled'
    id: string
    email: string
    thumb_url: string
    url: string
    member_id: string
    tierId: string
    patron_status: string
    last_charge_status: string
    next_charge_date: string
}