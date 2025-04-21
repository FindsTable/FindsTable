import { readEvent } from '@/server/apiUtils/readEvent'
import { deleteItemById, getItemsByQuery } from '@/server/directus/items'
import { ItemObject } from '@/shared/types/dataObjects'
import { H3Event } from 'h3'
import { validateUser } from '@/server/utils/validation'
import { updateItemsCountField } from '@/server/utils/apiContentUtils'

export default defineEventHandler(async <ExpectedItemObject extends ItemObject>(
event: H3Event
): Promise<ApiResponse<ExpectedItemObject | null>> => {
    // Read event and ensure token exists.
    const {
        body,
        bearerToken,
        error : tokenError
    } = await readEvent(event, [
        'body', 'bearerToken']
    )

    if (tokenError) return tokenError

    if (!body?.id || !body?.collection) {
        return {
            ok: false,
            statusText: 'No id or collection provided.',
            data: null
        }
    }

    const countField = itemsCountField(body.collection)

    if(!countField) {
        return {
            ok: false,
            statusText: 'Something seems wrong with the provided collection name.'
        }
    }

    const currentUser = await validateUser({
        bearerToken: bearerToken!,
        fields: [
            'id', countField
        ]
    })

    if( !currentUser || !currentUser.id ) {
        return {
            ok: false,
            statusText: 'User is not logged in or dont exist'
        }
    }

    const res = await deleteItemById({
        auth: bearerToken,
        collection: body.collection,
        id: body.id,
    })

    if(!res) {
        return {
            ok: false,
            statusText: 'Could not delete you item'
        }
    }

    await updateItemsCountField({
        bearerToken: bearerToken!,
        field: countField,
        newValue: currentUser[countField] - 1
    })

    return {
        ok: true,
        statusText: `Item deleted from the ${body.collection} collection !`,
    }
})

function itemsCountField(requestCollection : string) {
    const r = requestCollection

    if(r === 'Thoughts') {
        return 'thoughts_count'
    }
    if(r === 'Finds') {
        return 'finds_count'
    }
    if(r === 'Avatars') {
        return 'avatars_count'
    }
    if(r.includes('comments')) {
        return 'comments_count'
    }
    return ''
}
