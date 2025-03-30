import { readEvent } from '@/server/apiUtils/readEvent'
import { createItem } from '@/server/directus/items'
import { ApiResponse } from '#shared/types/apiResponse'
import { getMe } from '@/server/directus/users'

type ItemObject = {
    [key: string]: any
}

export default defineEventHandler(async (event): Promise<ApiResponse<ItemObject | null>> => {

    const {
        body,
        query,
        bearerToken,
        collection,
        error        
    } = await readEvent(event, [
        'body', 'query', 'bearerToken', 'paramCollection']
    )
    
    if(error) return error

    const userId = await getUserId(bearerToken!)

    if(!userId) {
        return {
            ok: false,
            statusText: 'Invalid auth token in items.create'
        }
    }

    const _body = {
        ...body,
        owner: userId
    }

    const res = await createItem<ItemObject>({
        auth: 'app',
        collection,
        body: _body,
        query
    })

    return res
})

async function getUserId(bearerToken : string) : Promise<string | null> {

    const meRes = await getMe({
        bearerToken,
        query: {
            fields: 'id'
        }
    })

    return meRes?.data?.id ? meRes.data.id : null
}