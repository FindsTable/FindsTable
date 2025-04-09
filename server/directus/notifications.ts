import {
    createItem
} from '@/server/directus/items'

export {
    createNotification
}


async function createNotification(p: {
    user_for: string
    user_from: string
    action: string
    content: string
}) {

    const res = await createItem({
        auth: 'app',
        collection: 'notifications',
        body: p,
        query: {
            fields: '*'
        }

    })

    return res
}