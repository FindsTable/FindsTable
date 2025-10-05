
import { H3Event } from 'h3'
import { assertItemCount } from '@@/server/utils/validation'
import { appPost } from '@@/server/directus/request'


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

    const res = await appPost<{data:any}>({
        endpoint: `/items/${body.collection}`,
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

    if(!res) {
        throw newError({
            code: 500,
            message: 'Request failed',
            reason: "No data in response"
        })
    }
    
    return res
})
