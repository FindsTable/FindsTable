import { directusAPI, DirectusAPIParams } from './main'

export {
    createItem,
    getItemById,
    getItemsByQuery,
    updateItemById,
    deleteItemById
}

async function createItem<
    ExpectedItemObject extends ItemObject
>(
    p: {
        auth: 'app' | BearerToken,
        collection: DirectusCollection
        body?: any
        query?: any
    }
): 
    Promise<ApiResponse<ExpectedItemObject | null>> 
{
    const params: DirectusAPIParams = {
        endPoint: `/items/${p.collection}`,
        method: 'POST',
        auth: p.auth
    }
    

    if(p.body) params.body = p.body
    if(p.query) params.query = p.query

    
    const res = await directusAPI(params)
    // return res
    if(!res.data) {
        return handleNoDataError('No data returned in /items => createItem()')
    }

    return res
}

async function getItemById<
    ExpectedItemObject extends ItemObject
>( 
    p: {
        auth: 'app' | BearerToken
        collection: DirectusCollection
        id: string
        query?: {
            fields?: string
        }
    } 
): 
    Promise<ApiResponse<ExpectedItemObject | null>> 
{
    const params: DirectusAPIParams = {
        endPoint: `/items/${p.collection}/${p.id}`,
        method: 'GET',
        auth: p.auth ,
        query: p.query
    }

    const res = await directusAPI(params)

    if(!res.data) {
        return handleNoDataError('No data returned in /items => getItemById()')
    }

    return res
}

async function getItemsByQuery<
    ExpectedItemObject extends ItemObject
>(
    p: {
        collection: DirectusCollection,
        auth: 'app' | BearerToken,
        query: Query
}): 
    Promise<ApiResponse<ExpectedItemObject[] | null>> 
{

    const res = await directusAPI({
        endPoint: `/items/${p.collection}`,
        method: 'GET',
        auth: p.auth,
        query: p.query
    })

    if(!res.data) {
        return handleNoDataError('No data returned in /items => getItemsByQuery()')
    }

    return res
}

async function updateItemById<
    ExpectedItemObject extends ItemObject
>(
    p: {
        id: string
        collection: DirectusCollection
        auth: 'app' | BearerToken
        body?: any
        query?: any
    }
): 
    Promise<ApiResponse<ExpectedItemObject | null>> 
{

    const res = await directusAPI({
        endPoint: `/items/${p.collection}/${p.id}`,
        method: 'PATCH',
        auth: p.auth,
        body: p.body,
        query: p.query
    })

    if(!res.data) {
        return handleNoDataError('No data returned in /items => updateItemById()')
    }

    return res
}

async function deleteItemById(
    p: {
        collection: string,
        id: string | number,
        auth: "app" | BearerToken | string
    }
): Promise<ApiResponse> {

    const res = await directusAPI({
        endPoint: `/items/${p.collection}/${p.id}`,
        method: 'DELETE',
        auth: p.auth
    })

    return res
}