import { readEvent } from '@/server/apiUtils/readEvent'
import { createItem } from '@/server/directus/items'
import { uploadFile } from '@/server/directus/files'
import { getItemById, getItemsByQuery } from '@/server/directus/items'
import { getMe } from '@/server/directus/users'
import { ItemObject } from '~/shared/types/dataObjects'
import { H3Event } from 'h3'
import { countMyItems, itemCountIsValid } from '@/server/directus/validation'


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

    const userId = await getUserId(bearerToken!)

    if (!userId) {
        return {
            ok: false,
            statusText: 'User is not logged in.',
            data: null
        }
    }
    
    const countValid = await itemCountIsValid({
        bearerToken: bearerToken!,
        field: 'thoughts'
    })

    if(countValid === undefined || countValid === null) {
        return {
            ok: false,
            data: null,
            statusText: 'An error has occured'
        }
    }
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
            owner: userId
        },
        query: {
            fields: '*,owner.avatar,owner.username'
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
