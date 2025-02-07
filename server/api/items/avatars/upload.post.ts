import { defineEventHandler, readFormData } from 'h3'
import { uploadFile } from '@/server/directus/files'
import { createItem } from '@/server/directus/items'

export default defineEventHandler(async (event) => {
    const formData = await readFormData(event)
    const userId = formData.get('user')

    if (!userId) {
        return newResponse({
            ok: false,
            status: 401,
            statusText: 'error.auth.missingUserId'
        })
    }

    const bearerToken = getHeader(event, 'Authorization')

    if(!bearerToken) {
        return newResponse({
            ok: false,
            status: 401,
            statusText: 'error.auth.noAccessToken'
        })
    }

    // must verify that user is allowed to upload file

    const file_res = await uploadFile(formData)

    // if(!file_res.ok) {
    //     return file_res
    // }

    const item_res = await createItem({
        auth: bearerToken,
        collection: 'Avatars',
        body: {
            image: file_res.data.id,
            user: userId.toString()
        }
    })
    
    return item_res
})