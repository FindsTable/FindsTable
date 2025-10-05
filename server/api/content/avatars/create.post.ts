import { createItem, updateItemById } from '@@/server/directus/items'
import { uploadFile } from '@@/server/directus/files'
import { H3Event } from 'h3'
import { assertItemCount } from '@@/server/utils/validation'
import { updateMe } from '@@/server/directus/users'
import { userGet } from '@@/server/directus/request' 

const avatarsFolderId = 'e82c8d84-9351-4e5b-a8bb-527757687066'
const allowedTypes = ['image/jpeg', 'image/png']

export default defineEventHandler(async <ExpectedItemObject extends ItemObject>(
event: H3Event
): Promise<any> => {

    const bearerToken = getHeader(event, 'authorization')

    if(!bearerToken) throw newError({
        code: 400,
        message: 'Unauthorized',
        reason: 'No bearer token'
    })

    const me = await userGet<{id: string}>({
        endpoint: '/users/me',
        bearerToken,
        query: {
            fields: "id"
        }
    })

    await assertItemCount({
        collection: 'Hunt_reports',
        userId: me.id
    })

    const requestFormData = await readMultipartFormData(event)
    if (!requestFormData || requestFormData.length !== 1) {
        return { 
            ok: false,
            statusText: 'Expected exactly one file upload.',
            data: null
        }
    }

    const fileEntry = requestFormData[0]
    if (!fileEntry.filename || !fileEntry.type) {
        throw createError({ statusCode: 400, message: 'Invalid file.' })
    }
    if (!allowedTypes.includes(fileEntry.type)) {
        throw createError({ statusCode: 400, message: 'Only JPG and PNG files are allowed.' })
    }

    const avatarItem = await createItem<any>({
        auth: 'app',
        collection: 'Avatars',
        body: {
            owner: me.id,
            currentAt: Date.now()
        },
        query: {
            fields: 'id'
        }
    })

    if (!avatarItem?.ok || !avatarItem?.data) {
        return {
            ok: false,
            statusText: `Failed to create avatar item`,
            data: null
        }
    }

    const itemId = avatarItem.data.id

    const directusForm = new FormData()
    directusForm.append('folder', avatarsFolderId)
    directusForm.append('Avatars_id', itemId) // for cascade deletion
    directusForm.append(
        'file',
        new Blob([fileEntry.data], { type: fileEntry.type }), // 👈 type added here
        fileEntry.filename
      )

    const fileRes = await uploadFile(directusForm)

    if (!fileRes.ok || !fileRes?.data?.id) {
        return {
            ok: false,
            statusText: `Failed to upload file : ${fileRes.statusText}`,
            data: null
        }
    }

    const fileId = fileRes.data.id

    const updateRes = await updateItemById({
        collection: 'Avatars',
        id: itemId,
        auth: 'app',
        body: {
            image: fileId
        }
    })

    updateMe({
        bearerToken: bearerToken!,
        body: {
            currentAvatar: itemId,
            avatar: fileId
        }
    })

    return {
        ok: false,
        statusText: `Failed to update avatar item : ${updateRes.statusText}`,
        data: null
    }
})
