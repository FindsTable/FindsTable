import { readEvent } from '@@/server/apiUtils/readEvent'
import { createItem } from '@@/server/directus/items'
import { ItemObject } from '#shared/types/dataObjects'
import { H3Event } from 'h3'
import { assertItemCount } from '@@/server/utils/validation'
import { userPost } from '@@/server/directus/request'


export default defineEventHandler(async <ExpectedItemObject extends ItemObject>(
event: H3Event
): Promise<any> => {
    // Read event and ensure token exists.

    const body = await readBody(event)
    const bearerToken = getHeader(event, 'authorization')

    if (!body?.item || !bearerToken || !body.userId) {
        throw newError({
            code: 400,
            message: 'Bad request.',
            reason: "request body missing data"
        })
    }
    
    await assertItemCount({
        userId: body.userId,
        collection: body.collection,
    })

    const res = await createItem({
        collection: body.collection,
        auth: 'app',
        body: {
            ...body.item,
            owner: {
                id: body.userId
            }
        },
        query: {
            fields: '*,owner.avatar,owner.username'
        }
    })

    if(!res?.data) {
        throw newError({
            code: 500,
            message: 'REquest failed',
            reason: "No data in response"
        })
    }
    
    return res.data
})
