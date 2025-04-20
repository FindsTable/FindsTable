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

    const currentUser = await validateUser({
        bearerToken: bearerToken!,
        fields: [
            'id', 'thoughts_count'
        ]
    })

    if( !currentUser || !currentUser.id ) {
        return {
            ok: false,
            statusText: 'User is not logged in or dont esist'
        }
    }

    const userId = currentUser.id

    if (!userId || typeof userId !== 'string') {
        return {
            ok: false,
            statusText: 'User is not logged in.',
            data: null
        }
    }
    
    const countValid = itemCountIsValid({
        collection: 'Thoughts',
        items_count: currentUser.thoughts_count
    })

    if(!countValid) {
        return {
            ok: false,
            data: null,
            statusText: 'You have reached the maximum numner of thoughts !'
        }
    }



    const res = await createItem({
        collection: 'Thoughts',
        auth: 'app',
        body: {
            ...body,
            owner: {
                id: userId,
                thoughts_count: currentUser.thoughts_count + 1
            }
        },
        query: {
            fields: '*,owner.avatar,owner.username,owner.id'
        }
    })

    if(!res?.data) {
        return {
            ok: false,
            data: null, 
            statusText: 'An error occured in /content/thoughts/create'
        }
    }

    return {
        ok: true,
        statusText: 'Your new thought has beed posted !',
        data: {
            ...res.data,
            countValid: countValid
        }
    }
  
})
