import { getUserId } from '@/server/directus/validation'
import { readEvent } from '@/server/apiUtils/readEvent'
import { createItem } from '@/server/directus/items'

const likeCollections = [
    'Finds_likes',
    'Thoughts_likes'
]

export default defineEventHandler(async <ExpectedItemObject extends ItemObject>(
event: H3Event
): Promise<ApiResponse<ExpectedItemObject | null>> => {
    // Read event and ensure token exists.
    const { 
        bearerToken, body,query, error: tokenError } = await readEvent(
            event, 
            ['bearerToken', 'body', 'query']
        )

    if (tokenError) return tokenError

    const userId = await getUserId(bearerToken!)

    if(!userId) {
        return {
            ok: false,
            statusText: 'Invalid token',
            data: null
        }
    }

    if(!likeCollections.includes(body.collection)) {
        return {
            ok: false,
            statusText: 'Invalid collection',
            data: null
        }
    }


    const uniqueKey = `${userId}-${body.itemData.find}}`

    const res = await createItem({
        auth: 'app',
        collection: body.collection,
        body: {
            ...body.itemData,
            unique_key: uniqueKey
        }
    })


    return {
        ok: true,
        statusText: 'Token is valid',
        data: null
    }
})