import { deleteFile } from '@/server/directus/files'
import { readEvent} from '@/server/apiUtils/readEvent'
import { ApiResponse } from '#shared/types/apiResponse'

export default defineEventHandler(async (event): Promise<ApiResponse<undefined>> => {
    
    const { id, bearerToken, error } = await readEvent(event, [ 'paramId', 'bearerToken' ])

    if (error) return error

    const res = await deleteFile({
        fileId: id,
        bearerToken : bearerToken!
    })

    return res
})