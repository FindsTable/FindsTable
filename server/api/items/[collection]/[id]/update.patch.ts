import { readEvent } from '~/server/apiUtils/readEvent'
import { ApiResponse } from '#shared/types/apiResponse'
import { updateItemById } from '@/server/directus/items';

type ItemObject = {
    [key: string]: any
}
export default defineEventHandler(async (event): Promise<ApiResponse<ItemObject>> => {

    const { 
        body, 
        query, 
        bearerToken, 
        collection,
        id, 
        error 
    } = await readEvent(event, [
        'body', 'query', 'bearerToken', 'paramCollection', 'paramId'
    ])

    if(error) return error

    const res = await updateItemById<ItemObject>({
        id: id,
        collection: collection,
        auth: bearerToken,
        body: body,
        query: query,
        
    })


    return res
})