import { directusAPI } from '@/server/directus/main'
import { ApiResponse, handleNoDataError } from '#shared/types/apiResponse'

export {
    get as getSingleton,
}

async function get<Data>(p: {
    auth: string,
    collection: string,
    query: any,
}): Promise<ApiResponse<Data | null>> {

    const res = await directusAPI({
        endPoint: `/items/${p.collection}`,
        auth: p.auth,
        method: 'GET',
        query: p.query,
    })

    if(!res.data) {
        return handleNoDataError('No data returned in /singleton => get()')
    }

    return res
}