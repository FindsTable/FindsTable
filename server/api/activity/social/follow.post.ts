import { readEvent } from '@/server/apiUtils/readEvent'
import { createItem } from '@/server/directus/items'
import { getMe, getUserById } from '@/server/directus/users'

type PartielFollowObject = {
    id: string
    follower: string
    followed: {
        id: string
        username: string
    }
}

export default defineEventHandler(async (
    event
): Promise<ApiResponse<PartielFollowObject | null>> => {

    const {
        body,
        bearerToken,
        error
    } = await readEvent(
        event, 
        [
            'body', 'bearerToken'
        ]
    )

    if (error) return error

    const valid = await user2IdIsValid(body.followedId)

    if (!valid) {
        return {
            ok: false,
            status: 401,
            statusText: 'target user id invalid'
        }
    }
    
    const myId = await getMe<{
        id: string
    }>({
        bearerToken,
        query: {
            fields: 'id'
        }
    })
    
    if (!myId.data) {
        return {
            ok: false,
            status: 403,
            statusText: 'Unauthorized bearerToken in /activity/social/follow.post'
        }
    }

    if (areIdentical(myId.data.id, body.followedId)) {
        return {
            ok: false,
            status: 400,
            statusText: 'trying to follow yourself'
        }
    }

    const res = await createItem<PartielFollowObject>({
        auth: bearerToken,
        collection: 'Follows',
        body: {
            follower: myId.data.id,
            followed: body.followedId,
            uniqueKey: `${myId.data.id}-${body.followedId}`
        },
        query: {
            fields: 'id,follower,followed.id,followed.username'
        }
    })

    if(!res.ok) {
        return {
            ok: false,
            status: 500,
            statusText: 'Error creating follow item in /activity/social/follow.post'
        }
    }

    if(!res.data) {
        return {
            ok: false,
            status: 500,
            statusText: 'No data returned from createItem in /activity/social/follow.post'
        }
    }

    return res
})

async function user2IdIsValid(user2Id: string) {
    const res: any = await getUserById({
        id: user2Id,
        query: {
            fields: 'id'
        },
        auth: 'app'
    })

    return res.ok
}

function createUniqueKey(user1: string, user2: string) {
    const [id1, id2] = [user1, user2].sort((a: any, b: any) => a - b);
    return `${id1}-${id2}`
}

function areIdentical(user1: string, user2: string) {
    return user1 === user2
}