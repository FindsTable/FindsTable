import { readEvent } from '@@/server/apiUtils/readEvent'
import { deleteItemById } from '@@/server/directus/items'
import { H3Event } from 'h3'
import { validateUser } from '@@/server/utils/validation'

export default defineEventHandler(async ( event: H3Event ) => {
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

    return {
        ok: true,
        statusText: `Item deleted from the ${body.collection} collection !`,
    }
})