import { readEvent } from '@/server/apiUtils/readEvent'
import { createItem } from '@/server/directus/items'
import { ApiResponse } from '#shared/types/apiResponse'

type ItemObject = {
    [key: string]: any
}

export default defineEventHandler(async (event): Promise<ApiResponse<ItemObject>> => {
    const {
        body,
        query,
        bearerToken,
        collection,
        error
    } = await readEvent(event, [
        'body', 'query', 'bearerToken', 'paramCollection'
    ])

    if (error) return error

    const res = await createItem<ItemObject>({
        auth: bearerToken,
        collection,
        query,
        body
    })

    return res
})