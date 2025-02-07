import { deleteItemById } from '@/server/directus/items'

export default defineEventHandler(async (event) => {

    const body = await readBody(event)
    const token = getHeader(event, 'Authorization')?.split(' ')[1]
    if (!token) {
        return newResponse({
            ok: true,
            status: 403,
            statusText: 'Unauthorized'
        })
    }

    const res = await deleteItemById({
        collection: 'Patreon_accounts',
        id: body.patreonAccountId,
        auth: `Bearer ${token}`
    })

    if(res?.ok) {
        return {
            ...res,
            message: 'success.patreon.accountUnlinked'
        }
    }
});
