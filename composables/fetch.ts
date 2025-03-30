import type { ApiResponse } from "@/shared/types/apiResponse"

export {
    use$Fetch,
    useSet$FetchTimeoutDuration
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

    const timeout = customTimeout || useAppConfig().fetchTimeout.adapted || useAppConfig().fetchTimeout.max

const controller = new AbortController();
const id = setTimeout(() => controller.abort(), timeout);

const res = $fetch<ExpectedData>(url, {
    ...options,
    signal: controller.signal,
    })
    .then((res) => {
        return res
    })
    .catch(() => {
        useSet$FetchTimeoutDuration()
        return getTimeOutResponse()
    })

    res.finally(() => clearTimeout(id));

    return res
}

function getTimeOutResponse(): ApiResponse {
    //declared as a function tobe able t use use$t outside of the nuxt context
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
}


async function useSet$FetchTimeoutDuration() {
    // console.log('Testing network...')
    // const fetchTimeout = useAppConfig().fetchTimeout

    // const testDuration = await useTestNetwork()

    // if(testDuration < 0) {
    //     console.log('timeoutDuration.adapted could not be set')
    //     return
    // }

    // const adapted = testDuration * fetchTimeout.multiplyfactor

    // if(adapted < fetchTimeout.min) {
    //     fetchTimeout.adapted = fetchTimeout.min
    // } else if(adapted > fetchTimeout.max) {
    //     fetchTimeout.adapted = fetchTimeout.max
    // } else {
    //     fetchTimeout.adapted = adapted
    // }
    //temporary solution set at 1500. Timeout is reached on netlify...

    // console.log('fetchTimeout.adapted', fetchTimeout.adapted)
}

async function useTestNetwork() {
    
    if (!navigator.onLine) {
        useAppState().value.internetConnection = false
        console.log('Browser is offline')

        useToaster('show', {
            id: 'offline',
            message: 'No internet connection available',
            type: 'error',
            autoClose: true,
            position: 'bottom'
        });

        return -1
    }

    const fetchWithTimeout = new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            reject(new Error('Request timed out'))
        }, timeoutDuration.max)

        $fetch('/api/app/network-test', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${useUserState().value.accessToken.value}`
            }
        }).then(response => {
            clearTimeout(timeout)
            resolve(response)
        }).catch(error => {
            clearTimeout(timeout)
            reject(error)
        })
    })

    try {
        const startTime = Date.now()
        await fetchWithTimeout
        const endTime = Date.now()
        const duration = endTime - startTime
        return duration
    } catch (error) {
        console.error('Error testing network:', error)
        return -1
    }
}