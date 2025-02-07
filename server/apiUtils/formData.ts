import { H3Event, readMultipartFormData } from 'h3';

export async function parseFormDataWithItem(event: H3Event, folderName: string): Promise<{
    file: FormData | null;
    item: Record<string, any> | null;
    error: { ok: boolean; status: number; statusText: string } | null;
}> {
    try {
        const formDataFields = await readMultipartFormData(event);

        if (!formDataFields) {
            throw new Error('Failed to read FormData');
        }

        const formData = new FormData();
        let item: Record<string, any> | null = null;

        for (const field of formDataFields) {
            if (field.name === 'item') {
                try {
                    item = JSON.parse(field.data.toString());
                } catch {
                    throw new Error('Failed to parse item as JSON');
                }
            } else if (field.name === 'file') {
                formData.append('folder', getFolderId(folderName));
                const blob = new Blob([field.data], { type: field.type });

                formData.append('file', blob, field.filename);
            } else {
                formData.append(field.name!, field.data.toString());
            }
        }

        return {
            file: formData,
            item,
            error: null,
        };
    } catch (err: any) {
        return {
            file: null,
            item: null,
            error: {
                ok: false,
                status: 400,
                statusText: err.message || 'Unknown error occurred',
            },
        };
    }
}

function getFolderId(folderName: string) {
    if (folderName === 'Avatars') return 'e82c8d84-9351-4e5b-a8bb-527757687066'
}