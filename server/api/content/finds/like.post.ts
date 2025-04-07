import { accessTokenIsValid } from '@/server/directus/validation'
import { readEvent } from '@/server/apiUtils/readEvent'
import { createItem } from '@/server/directus/items'

export default defineEventHandler(async <ExpectedItemObject extends ItemObject>(
event: H3Event
): Promise<ApiResponse<ExpectedItemObject | null>> => {
    // Read event and ensure token exists.
    const { bearerToken, error: tokenError } = await readEvent(event, ['bearerToken'])

    if (tokenError) return tokenError


    const isValid = await accessTokenIsValid(bearerToken!)

    if(!isValid) {
        return {
            ok: false,
            statusText: 'Invalid token',
            data: null
        }
    }
 

    return {
        ok: true,
        statusText: 'FToken is valid',
        data: null
    }
})


