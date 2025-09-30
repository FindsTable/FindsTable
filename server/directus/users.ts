import { directusAPI } from './main';
import { Query, Body, BearerToken } from '@@/server/directus/types/sdk/fetch';
import { ApiResponse, handleNoDataError } from '#shared/types/apiResponse';

export { 
    getMe, 
    getUserById, 
    userTokenIsValid, 
    getUsersByQuery, 
    updateUserById, 
    updateMe,
    getUserCount
}

async function getMe<Data extends UserObject>(
    p: { 
        bearerToken: BearerToken | undefined | string
        query: Query
    }
): Promise<ApiResponse<Data | null>> {
    const res = await directusAPI({
        endPoint: '/users/me',
        method: 'GET',
        auth: p.bearerToken,
        query: p.query,
    })

    if (!res.data) {
        return handleNoDataError('No data returned in /users => getMe()')
    }

    return res
}

async function getUserById<
    Data extends UserObject
>(
    p: { 
        id: string; query: Query
        auth: 'app' | BearerToken 
    }
): 
    Promise<ApiResponse<Data | null>> 
{
    const res = await directusAPI({
        endPoint: `/users/${p.id}`,
        method: 'GET',
        auth: p.auth,
        query: p.query || { fields: '*' },
    })

    if (!res.data) {
        return handleNoDataError('No data returned in /users => getUserById()')
    }

    return res
}

async function userTokenIsValid(
    token: string
): 
    Promise<boolean> 
{
    const res = await directusAPI({
        endPoint: '/users/me',
        method: 'GET',
        auth: `Bearer ${token}`,
        query: { fields: '*' },
    })

    return res.ok && res.data ? true : false;
}

async function getUsersByQuery<
    ExpectedUserObject extends UserObject
>(
    p: { 
        auth: BearerToken | 'app';
        query: Query 
    }
): 
    Promise<ApiResponse<ExpectedUserObject[] | null>> 
{
    
    const res = await directusAPI({
        endPoint: '/users',
        method: 'GET',
        auth: p.auth,
        query: p.query,
    })

    if (!res.data) {
        return handleNoDataError('No data returned in /users => getUsersByQuery()')
    }

    return res
}

async function updateUserById<
    ExpectedUserObject extends UserObject
>(
    p: { 
        id: string; 
        auth: BearerToken | 'app'
        body: Body; query?: Query
    }
): 
    Promise<ApiResponse<ExpectedUserObject | null>> 
{
    const res = await directusAPI({
        endPoint: `/users/${p.id}`,
        method: 'PATCH',
        auth: p.auth,
        body: p.body,
        query: p.query,
    })

    if (!res.data) {
        return handleNoDataError('No data returned in /users => updateUserById()')
    }

    return res
}

async function updateMe<
    ExpectedUserObject extends UserObject
>(
    p: { 
        bearerToken: string; 
        body: Body
        query?: Query
    }
): 
    Promise<ApiResponse<ExpectedUserObject | null>> 
{
    const res = await directusAPI({
        endPoint: '/users/me',
        method: 'PATCH',
        auth: p.bearerToken,
        body: p.body,
        query: p.query,
    })

    if (!res.data) {
        return handleNoDataError('No data returned in /users => updateMe()')
    }

    return res
}

async function getUserCount(): Promise<number | undefined> {
    const res = await directusAPI({
        endPoint: '/users',
        method: 'GET',
        auth: 'app',
        query: {
            aggregate: { count: '*' }
        }
    })

    if (!res.data) {
        return undefined
    }

    console.log(res.data[0].count)

    return res.data[0].count
}