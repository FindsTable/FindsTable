import { getUserId } from '@/server/directus/validation'
import { readEvent } from '@/server/apiUtils/readEvent'
import { createItem } from '@/server/directus/items'
import { createNotification } from '@/server/directus/notifications'

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
        },
        query: {
            fields: 'user, item.owner, item.id'
        }
    })
    console.log(res)
    if(!res?.data) {
        return {
            ok: false,
            statusText: 'No data returned',
            data: null
        }
    }

    // buildNotification(res.data)

    return {
        ok: true,
        statusText: 'Token is valid',
        data: res
    }
})

function buildNotification(likeData : any) {

    console.log(likeData)
    // const notif = {
    //     user_for: '',
    //     user_from: item.user,
    //     action: '',
    //     content: ''
    // }
}