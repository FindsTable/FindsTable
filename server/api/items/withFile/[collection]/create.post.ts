import { readEvent } from '@/server/apiUtils/readEvent'
import { createItem } from '@/server/directus/items'
import { parseFormDataWithItem } from '@/server/apiUtils/formData'
import { uploadFile } from '@/server/directus/files'
import { ItemObject } from '~/shared/types/dataObjects';

export default defineEventHandler(async <
    ExpectedItemObject extends ItemObject
>(
    event: H3Event
): Promise<ApiResponse<ExpectedItemObject | null>> => {

    const { 
        collection,
        bearerToken,
        error: tokenError, 
    } = await readEvent(
        event, 
        ['bearerToken', 'paramCollection']
    )

        if(tokenError) return tokenError

    const {file, item, error : formDataError} = await parseFormDataWithItem(event, 'Avatars')
    
        if (formDataError) return formDataError

    const fileRes = await uploadFile( file! )

        if (!fileRes.ok || !fileRes.data) {
            return {
                ok: false,
                status: 500,
                statusText: 'Could not upload file',
            }
        }

    const itemRes = await createItem<ExpectedItemObject>({
        collection: collection,
        auth: bearerToken,
        body: {
            ...item!.body,
            image: fileRes.data.id
        },
        query: item!.query
    })

    return itemRes
});