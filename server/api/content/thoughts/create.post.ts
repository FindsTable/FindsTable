import { H3Event } from 'h3'
import { assertItemCount, getUserId } from '@@/server/utils/validation'
import { appPost } from '@@/server/directus/request'

export default defineEventHandler(async <ExpectedItemObject>(
event: H3Event
): Promise<any> => {
    // Read event and ensure token exists.

    const body = await readBody(event)
    const bearerToken = getHeader(event, 'authorization')

    if(!body || !bearerToken) throw newError({
        code: 403,
        message: "Bad request",
        reason: "Missing body or bearerToken"
    })

    const userId = await getUserId(bearerToken)

    await assertItemCount({
        collection: 'Thoughts',
        userId: userId
    })

    const res = await appPost<any>({
        endpoint: '/items/Thoughts',
        body: {
            ...body,
            owner: userId
        },
        query: {
            fields: '*,owner.avatar,owner.username,owner.id'
        }
    })

    return {
        ok: true,
        statusText: 'Your new thought has been posted !',
        data: res
    }
})
