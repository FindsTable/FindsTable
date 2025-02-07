export {
    defaultUserState,
    defaultUserState_patreon_account
}

const defaultUserState_patreon_account = {
    id: '',
    first_name: '',
    full_name: '',
    email: '',
    thumb_url: '',
    url: '',
    tier: '',
    patron_status: '',
    access_token: '',
    expires_at: 0,
    token_type: '',
    refresh_token: ''
}

const defaultUserState = {
    isLoggedIn: false,
    avatarFileId: '',
    username: '',
    email: '',
    id: '',
    accessToken: {
        value: '',
        expires_at: 0
    },
    patreon_account: defaultUserState_patreon_account
}

