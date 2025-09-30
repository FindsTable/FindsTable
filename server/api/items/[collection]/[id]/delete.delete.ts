import { readEvent } from '@@/server/apiUtils/readEvent'

import { ApiResponse } from '#shared/types/apiResponse'
import { deleteItemById } from '@@/server/directus/items';

export default defineEventHandler(async (event): Promise<ApiResponse<undefined>> => {

    const {
        bearerToken,
        collection,
        id,
        error
    } = await readEvent(event, [
        'bearerToken', 'paramCollection', 'paramId'
    ])

    if(error) return error

    if(bearerToken === 'app') {
        return null  // needs to be written correctly
    }

    const res = await deleteItemById({
        collection: collection,
        id: id,
        auth: bearerToken
    })

    return res
})