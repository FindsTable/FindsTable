import { readEvent } from '@@/server/apiUtils/readEvent'
import { createItem, updateItemById } from '@@/server/directus/items'
import { uploadFile } from '@@/server/directus/files'
import { ItemObject } from '#shared/types/dataObjects'
import { H3Event } from 'h3'
import { itemCountIsValid, validateUser } from '@@/server/utils/validation'
import { updateItemsCountField as incrementAvatarsCount } from '@@/server/utils/apiContentUtils'
import { updateMe } from '@@/server/directus/users'

const avatarsFolderId = 'e82c8d84-9351-4e5b-a8bb-527757687066'
const allowedTypes = ['image/jpeg', 'image/png']

export default defineEventHandler(async <ExpectedItemObject extends ItemObject>(
event: H3Event
): Promise<ApiResponse<ExpectedItemObject | null>> => {

    const bearerToken = getHeader(event, 'authorization')
    if(!bearerToken) throw newError({
        code: 400,
        message: 'Unauthorized',
        reason: 'No bearer token'
    })

    const userId = await userIsValid(bearerToken)

    await itemCountIsValid({
        collection: 'Hunt_reports',
        userId: userId
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
            owner: userId,
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

    if (updateRes.ok && updateRes.data) {
        await incrementAvatarsCount({
            bearerToken: bearerToken,
            field: 'avatars_count',
            newValue: currentUser.avatars_count + 1
        })

        return {
            ok: true,
            data: updateRes.data,
            statusText: 'Success, here is you new avatar item'
        }
    }

    return {
        ok: false,
        statusText: `Failed to update avatar item : ${updateRes.statusText}`,
        data: null
    }
})
