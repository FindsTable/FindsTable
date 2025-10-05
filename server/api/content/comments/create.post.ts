import { createItem } from '@@/server/directus/items'
import { ItemObject } from '#shared/types/dataObjects'
import { H3Event } from 'h3'
import { itemCountIsValid } from '@@/server/utils/validation'
import { appPost } from '@@/server/directus/request'


export default defineEventHandler(async <ExpectedItemObject extends ItemObject>(
event: H3Event
): Promise<any> => {

    const body = await readBody(event)
    const bearerToken = getHeader(event, 'authorization')
    // return {
    //     endpoint: `/items/${body.collection}`,
    //     bearerToken: bearerToken,
    //     body: {
    //         ...body.item,
    //         owner: {
    //             id: body.userId
    //         }
    //     },
    //     query: {
    //         fields: '*,owner.avatar,owner.username'
    //     }
    // }

    if(!bearerToken || !body) throw newError({
        code: 400,
        message: 'Bad request',
        reason: 'Missing body or access token from request.'
    })

    const userId = await userIsValid(bearerToken)

    await itemCountIsValid({
        collection: body.collection,
        userId: body.userId
    })

    const res = await appPost({
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

    return res
})
