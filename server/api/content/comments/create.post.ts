import { readEvent } from '@/server/apiUtils/readEvent'
import { createItem } from '@/server/directus/items'
import { ItemObject } from '~/shared/types/dataObjects'
import { H3Event } from 'h3'
import { itemCountIsValid, validateUser } from '@/server/utils/validation'


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
        collection: 'All_comments',
        items_count: currentUser.comments_count || 0
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
            owner: {
                id: userId,
                comments_count: currentUser.comments_count + 1
            }
        },
        query: {
            fields: '*,owner.avatar,owner.username'
        }
    })

    if(!res?.data) {
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
