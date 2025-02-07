import { readEvent } from '~/server/apiUtils/readEvent'
import { getItemsByQuery } from '@/server/directus/items';


type ItemObject = {
    [key: string]: any
}

export default defineEventHandler(async (event): Promise<ApiResponse<ItemObject[]>> => {
    
    const {
        query, 
        bearerToken, 
        collection, 
        error
    } = await readEvent(event, ['query', 'bearerToken', 'paramCollection'])
    
    if(error) return error
 

    const res = await getItemsByQuery<ItemObject[]>({
        collection: collection,
        auth: bearerToken,
        query: query ? query : {}
    })

    return res
})