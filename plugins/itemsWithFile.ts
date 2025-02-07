import type { ParsedApiResponse } from '@/composables/apiResponse'
export default defineNuxtPlugin(() => {
    return {
        provide: {
            itemsWithFile: {
                create
            }
        }
    }
})

async function create<
    Data
>(
    p: {
        collection: string,
        item: {
            [key: string]: any
        },
        file: File,
        user: string,
        owner: string,
        query?: any
    }
) : 
    Promise<ParsedApiResponse<Data | null>>
{
    const formData = new FormData();
    formData.append('item', JSON.stringify(p.item));
    formData.append('user', p.user.toString()); // deprecated, rep^laces by owner O2M field
    formData.append('owner', p.user.toString());
    formData.append('file', p.file);

    const res = await $fetch<any>(
        `/api/items/withFile/${p.collection}/create`,
        {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${useUserState().value.accessToken.value}`,
            },
            body: formData,
            query: p.query ? p.query : {}
        }
    )

    return useParseApiResponse<Data>(res)

}