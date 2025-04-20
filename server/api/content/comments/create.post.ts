import { readEvent } from '@/server/apiUtils/readEvent'
import { createItem } from '@/server/directus/items'
import { getMe } from '@/server/directus/users'
import { ItemObject } from '~/shared/types/dataObjects'
import { H3Event } from 'h3'
import { itemCountIsValid, validateUser } from '@/server/utils/validation'
import { updateItemsCountField as incrementCommentsCount } from '@/server/utils/apiContentUtils'


export default defineEventHandler(async <ExpectedItemObject extends ItemObject>(
event: H3Event
): Promise<ApiResponse<ExpectedItemObject | null>> => {
    // Read event and ensure token exists.
    const {
        body,
        query,
        bearerToken,
        error : tokenError
    } = await readEvent(event, [
        'body', 'query', 'bearerToken']
    )

    if (tokenError) return tokenError

    if (!body?.item) {
        return {
            ok: false,
            statusText: 'No item object provided.',
            data: null
        }
    }

    const currentUser = await validateUser({
        bearerToken: bearerToken!,
        fields: [
            'id', 'comments_count'
        ]
    })

    if( !currentUser || !currentUser.id ) {
        return {
            ok: false,
            statusText: 'User is not logged in or dont esist'
        }
    }

    const userId = currentUser.id

    if (!userId) {
        return {
            ok: false,
            statusText: 'User is not logged in.',
            data: null
        }
    }
    
    const countValid = itemCountIsValid({
        collection: body.collection,
        items_count: currentUser.comments_count
    })

    if(!countValid) {
        return {
            ok: false,
            data: null,
            statusText: 'You have reached the maximum numner of comments !'
        }
    }

    const res = await createItem({
        collection: body.collection,
        auth: 'app',
        body: {
            ...body.item,
            owner: userId
        },
        query: {
            fields: '*,owner.avatar,owner.username'
        }
    })

    if(!res?.data) {

        await incrementCommentsCount({
            bearerToken: bearerToken!,
            field: 'comments_count',
            newValue: currentUser.comments_count + 1
        })

        return {
            ok: false,
            data: null, 
            statusText: 'An error occured in /content/comments/create'
        }
    }

    return {
        ok: true,
        statusText: 'Your new thought has beed posted !',
        data: {
            ...res.data
        }
    }
  
})


// Helper to get user id
async function getUserId(bearerToken: string): Promise<string | undefined> {
    const { data } = await getMe({
        bearerToken: bearerToken,
        query: {
            fields: 'id'
        }
    })

    return data ? data.id : undefined
}
