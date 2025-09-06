import type { ApiResponse } from "@@/server/types/apiResponse"

export {
    use$Fetch
}

const timeoutDuration: {
    multiplyfactor: number
    min: number
    max: number
    adapted: number
} = {
    multiplyfactor: 2,
    min: 100,
    max: 5000,
    adapted: 0
}

async function use$Fetch<ExpectedData>(
    url: string,
    options = {},
    customTimeout?: number
): Promise<ApiResponse<ExpectedData | null>> {

    const timeout = customTimeout || useAppConfig().fetchTimeout.max

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    const res = $fetch<ExpectedData>(
        url, 
        {
            ...options,
            signal: controller.signal,
        }
    ).then((res) => {
        return res
    }).catch(() => {
        return {
            ok: false,
            status: 500,
            statusText: 'Timeout',
            feedback: {
                toaster: {
                    message: use$t('error.server.timeout'),
                    type: 'error',
                }
            }
        }
    })

    res.finally(() => clearTimeout(id));

    return res
}
