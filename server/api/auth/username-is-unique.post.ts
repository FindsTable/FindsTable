import { readEvent } from '@/server/apiUtils/readEvent'
import { directusAPI } from '@/server/directus/main'
import { getUsersByQuery } from '@/server/directus/users'
import { onKeyDown } from '@vueuse/core'
import { ApiResponse } from '#shared/types/apiResponse'

export default defineEventHandler( async(
    event
): Promise<ApiResponse<boolean>> => {

    const { body, error } = await readEvent(event, [ 'body'])

    if(error) return error

    const res = await getUsersByQuery<{
        id: string
    }>({
        auth: 'app',
        query: {
            filter: {
                username: {
                    _eq: body.username
                }
            },
            fields: 'id'
        }
    })

    if(!res.ok || !res.data) {
        return {
            ok: false,
            status: 400,
            statusText: 'Unauthorized',
            data: false
        }
    }

    return {
        ok: true,
        status: 200,
        statusText: 'OK',
        data: !res.data.length
    }
})