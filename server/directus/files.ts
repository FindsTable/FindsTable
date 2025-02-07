import { directusAPI } from '@/server/directus/main'

export {
    uploadFile,
    deleteFile
}

async function uploadFile(
    formData: FormData
): 
    Promise<ApiResponse<{id: string } | null>> 
{

    const res = await directusAPI({
        endPoint: '/files',
        method: 'POST',
        body: formData,
        auth: 'app',
        query: {
            fields: "id"
        }
    })

    if(!res.data) {
        return handleNoDataError('No data returned in /files => uplaodFile()')
    }

    return res
}

async function deleteFile(
    p: {
       fileId: string,
        bearerToken: string
}): 
    Promise<ApiResponse<undefined>>
{
    const res = await directusAPI({
        endPoint: `/files/${p.fileId}`,
        method: 'DELETE',
        auth: p.bearerToken
    })

    return res
}