export type{
    ApiResponse,
    FeedbackType
}
export {
    newResponse,
    handleNoDataError
}

interface ApiResponse<Data> {
    ok: boolean
    status?: number
    statusText: string
    data?: Data
    feedback?: {
        toaster: {
            messagePath?: string,
            message?: string
            type: FeedbackType
        }
        tips?: [{
            messagePath: string
        }]
    }
}

function newResponse<Data = undefined>(
    res: ApiResponse<Data>
): ApiResponse<Data> {
    return res
}

type FeedbackType = 
    'success' | 
    'error' | 
    'warning' | 
    'tip' | 
    'danger' | 
    'info' | 
    'confirmation'



function handleNoDataError(statusText: string): ApiResponse<null> {
    return {
        ok: false,
        status: 500,
        statusText,
        data: null,
    };
}