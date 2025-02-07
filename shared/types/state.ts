export type { UserState }

type UserState = {
    isLoggedIn: boolean
    avatar: string
    username: string
    displayName: string
    email: string
    id: string
    accessToken: {
        value: string
        expires_at: number
    }
    patreon_account: UserState_Patreon,
    personalDataRecord: personalDataRecord
}

type UserState_Patreon = {
    id?: string
    email?: string
    first_name?: string
    full_name?: string
    url?: string
    thumb_url?: string
    patron_status?: string
    tier?: any
    access_token?: string
    expires_at?: number
    token_type?: string
    refresh_token?: string

}

type personalDataRecord = {
    email: null | {
        id: string,
        value: string,
        public: boolean
    },
    firstName: null | {
        id: string,
        value: string,
        public: boolean
    },
    lastName: null | {
        id: string,
        value: string,
        public: boolean
    }
}