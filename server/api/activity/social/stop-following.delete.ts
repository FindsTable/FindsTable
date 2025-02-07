import { readEvent } from '@/server/apiUtils/readEvent'
import { deleteItemById } from '@/server/directus/items'
import { ApiResponse } from '#shared/types/apiResponse'

export default defineEventHandler(async (
    event
): Promise<ApiResponse<undefined>> => {

    const {
        body,
        bearerToken,
        error
    } = await readEvent(event, [
        'body', 'bearerToken']
    )

    if (error) return error

    const res = await deleteItemById({
        collection: 'Follows',
        id: body.followId,
        auth: bearerToken
    })

    return res
})