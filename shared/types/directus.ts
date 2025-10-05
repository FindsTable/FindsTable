export type {
    DirectusTokens,
    AccessToken,
    BearerToken
}

type DirectusTokens = {
    access_token: string,
    refresh_token: string,
    expires: number
}

type AccessToken = {
    value: string,
    expires: number
}

type BearerToken = string