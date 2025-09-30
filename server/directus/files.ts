import { directusAPI } from '@@/server/directus/main'
import { updateItemById  } from './items'
export {
    uploadFile,
    deleteFile,
    addFileToItem
}

type addFileToItemResponse = {
  file: { 
    id: string | undefined; 
    uploaded: boolean; 
    linked: boolean };
  item: any;
};

async function addFileToItem(p: {
  file: FormData;
  item: {
    collection: string;
    id: string;
    field: {
      name: string;
      /**
       * If the field stores multiple file UUIDs, pass the current value here
       * so we can append to it. If it's a single file field, leave undefined.
       */
      currentIds?: string[];
    };
  };
}): Promise<addFileToItemResponse> {

    const output: addFileToItemResponse = {
        file: { 
            id: undefined, 
            uploaded: false, 
            linked: false 
        },
        item: undefined,
    };

    // 1) Upload file to directus_files
    const resFile = await uploadFile(p.file);

    const fileId = resFile?.data?.id as string | undefined;

    if (!fileId) return output;

    output.file.id = fileId;
    output.file.uploaded = true;

    // 2) Compute field value to send (single vs o2m)
    let newFieldValue: string | string[] | undefined;

    if (Array.isArray(p.item.field.currentIds)) {
        // o2m field: use a set for uniqueness
        const mergedIds = new Set([...p.item.field.currentIds, fileId]);
        newFieldValue = Array.from(mergedIds);
    } else {
        // Single: assign UUID directly
        newFieldValue = fileId;
    }

    // 3) Update the parent item

    const resItem = await updateItemById<any>({
        id: p.item.id,
        collection: p.item.collection,
        auth: "app",
        body: { 
            [p.item.field.name]: newFieldValue 
        },
        // Return only the field you touched (adjust if you need more)
        query: { 
            fields: p.item.field.name 
        }
    });

    if (resItem?.data) {
        output.item = resItem.data;
        output.file.linked = true;
    }

    return output;
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
        return handleNoDataError('No data returned in /files => uploadFile()')
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