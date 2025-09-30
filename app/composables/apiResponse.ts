import type { ToasterData } from '@/composables/toaster';

export type { ParsedApiResponse };
export { useParseApiResponse };

function useParseApiResponse<
    Data extends any
>(
    r: ApiResponse<any>
): 
    ParsedApiResponse<Data>
{
    if (!r) {
        return {
            ok: false,
            data: null,
            toaster: {
                id: Date.now().toString(),
                messagePath: 'error.unknown',
                type: 'error',
                autoClose: true,
                position: 'bottom',
            },
            tips: null,
        };
    }

    return {
        ok: r.ok,
        data: r.data ?? null, // Use null if data is undefined
        toaster: r.feedback
            ? {
                  id: Date.now().toString(),
                  ...r.feedback.toaster,
                  autoClose: true,
                  position: 'bottom',
              }
            : null,
        tips: r.feedback?.tips ?? null,
    };
}

interface ParsedApiResponse<Data = any> {
    ok: boolean;
    data: Data | null;
    toaster?: ParsedApiResponseToasterData | null;
    tips?: Array<{ [key: string]: any }> | null;
    error?: any
}

interface ParsedApiResponseToasterData {
    id: ToasterData['id'];
    message?: ToasterData['message'];
    messagePath?: ToasterData['messagePath'];
    type: ToasterData['type'];
    autoClose: ToasterData['autoClose'];
    position: ToasterData['position'];
}
