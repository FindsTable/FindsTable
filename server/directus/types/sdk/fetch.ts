export {
    Method,
    Headers,
    ContentType,
    BearerToken,
    Query,
    Body,
    authHeader,
    EndPoint
}

type Method = 'GET' | 'POST' | 'PATCH' | 'DELETE'

type Headers = {
    'Content-Type'?: ContentType,
    'Authorization'?: authHeader
}

type authHeader = BearerToken | undefined

type ContentType = 'application/json' | 'multipart/form-data'
type BearerToken = `Bearer ${string}` | string | undefined
type Query = {
    "fields"?: string,
    "filter"?: object,
    "aggregate"?: object
}
type Body = { [key: string]: string | number | boolean | object } | FormData

type EndPoint =
    `/items` |
    `/items/${Collection}` |
    `/items/${Collection}/${Id}` |
    `/users` |
    `/users/me` |
    `/users/${Id}` |
    '/auth/login' |
    '/auth/logout' |
    '/auth/refresh' |
    '/files' |
    `/files/${string}` |
    '/roles'

type Collection = string
type Id = string


