import { getSingleton } from '@@/server/directus/singleton'
import { readEvent } from '@@/server/apiUtils/readEvent'

import { newResponse, ApiResponse } from '#shared/types/apiResponse'

type ConfigObject = {
    id: string
    testFile: string
}

export default defineEventHandler(async (
    event
): Promise<ApiResponse<File | null>> => {

    const { bearerToken, query, error } = await readEvent(event, ['bearerToken', 'query'])

    if(error) return error

    const res = await getSingleton<ConfigObject>({
        auth: bearerToken!,
        collection: 'CONFIG',
        query: query!
    })

    if(!res.ok || !res.data) {
        return newResponse({
            ok: false,
            status: 500,
            statusText: 'No data returned in /singleton => get()',
            data: null
        })
    }

    const file = await $fetch<File>(
        `https://admin.findstable.net/assets/${res.data.testFile}`
    )

    return newResponse({
        ok: true,
        status: 200,
        statusText: 'OK',
        data: file
    })
})