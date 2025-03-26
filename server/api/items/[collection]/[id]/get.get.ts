import { readEvent } from '@/server/apiUtils/readEvent'
import { ApiResponse } from '#shared/types/apiResponse'
import { getItemById } from '@/server/directus/items';

type ItemObject = {
    [key: string]: any
}

export default defineEventHandler(async (event): Promise<ApiResponse<ItemObject>> => {
    const {
        query,
        bearerToken,
        collection,
        id,
        error
    } = await readEvent(event, [
        'query', 'bearerToken', 'paramCollection', 'paramId'
    ])

    if(error) return error

    const res = await getItemById<ItemObject>({
        auth: bearerToken,
        collection,
        id,
        query
    })

    return res
})