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
        expires: number
    }
    patreon_account: FT_patreon_account | null,
    personalDataRecord: personalDataRecord
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
    },
    country: null | {
        id: string,
        value: string,
        public: boolean
    }
}