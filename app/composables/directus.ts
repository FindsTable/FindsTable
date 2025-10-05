export {
    useDirectAsyncFetch,
    useDirectGetOnMounted
}

export type {
    Options as DirectFetchOptions
}

function useDirectGetOnMounted<T>(
    endpoint: string,
    query?: any
): {
    data : Ref<T>,
    pending: Ref<boolean>,
    refresh: Function
} {
    const data = ref<T | null>(null)
    const pending = ref<boolean>(true)

    async function directGet() {
        const res = await $fetch<{data: T}>(
            `https://admin.findstable.net${endpoint}`,
            {
                method: 'GET',
                headers: {
                    authorization: `Bearer ${useUserState().value.accessToken.value}`
                },
                query: query
            }
        )

        data.value = res.data
        pending.value = false
    }

    function refresh() {
        directGet()
    }

    onMounted(async() => {
        try {
            await directGet()
        } catch(err) {
            useHandleError(err)
            pending.value = false
        }
    })

    return {
        data: data as Ref<T>,
        pending,
        refresh
    }
}

function useDirectAsyncFetch<T = any>(
    method?: Method,
    path?: string,
    options?: Options
): UseDirectFetchReturn<T> {

    const _response = ref<T | null>(null) as Ref<T | null>
    const _error = ref<Record<string, any> | null>(null)
    const isPending = ref(false)
  
    async function directFetch<Expected>(
        method: Method ,
        path: string,
        options?: Options
    ): Promise<{ response: Expected | null, error: any | null }> {

        let response: Expected | null = null
        let error: any | null = null
      
        await $fetch<DirectusResponse<Expected>>(
            `${useAppConfig().directusUrl}${path}`, 
            {
                method,
                headers: {
                    authorization: `Bearer ${useUserState().value.accessToken.value}`
                },
                ...options,
                onRequest: () => {
                    options?.onRequest?.()
                },
                onResponse: (res) => {
                    const data: any = res?.response?._data?.data || null
                  
                    if (options?.singleItem && Array.isArray(data)) {
                        response = data[0]
                    } else {
                        response = data
                    }
                    
                    options?.onResponse?.(response)
                },
                onResponseError: (err) => {
                    error = err.response?._data || { message: 'Unknown error' }
                    options?.onResponseError?.(error)
                }
            }
        ).catch((err) => {
            error = err.response?._data || { message: 'Unexpected fetch error' }
        })

        return {
            response,
            error
        }
    }

    async function runDirectFetch() {
        if (!method || !path) {
            console.warn('[useDirectAsyncFetch] Missing method or path. Nothing will be fetched.')
            return
        }

        if (isPending.value) return
        isPending.value = true

        const {
            response, 
            error
        } = await directFetch<T>(
            method, path,
            options
        )

        _error.value = error
        _response.value = response
        isPending.value = false
    }

    async function differedFetch(): Promise<void> {
        runDirectFetch()
    }

    async function refresh(): Promise<void> {
        runDirectFetch()

    }

    if (!options?.differed && method && path) {
        console.log('fetching', method, path)
        runDirectFetch()
    }
  
    return {
        response: _response,
        error: _error,
        isPending,
        refresh,
        differedFetch,
        directFetch
    }
}

/**
 * Signature for useDirectAsyncFetch composable
 */
export type UseDirectAsyncFetch = <T = any>(
    method: Method,
    path: string,
    options?: Options
) => UseDirectFetchReturn<T>

/**
 * Return value of the useDirectAsyncFetch composable
 */
export type UseDirectFetchReturn<T> = {
    response: Ref<T | null>
    error: Ref<Record<string, any> | null>
    isPending: Ref<boolean>
    /**
     * Trigger a fresh fetch and update internal state
     */
    refresh: () => Promise<void>
    differedFetch: () => Promise<void>
    /*
    * use direct fetch to make request without affecting response and error state
    */
    directFetch: <expected>(
        method: Method,
        path: string,
        options?: Options
    ) => Promise<{ 
        response: expected | null, 
        error: any | null 
    }>
}

// Options for each fetch call
type Options = {
    body?: any
    query?: any
    differed?: boolean
    singleItem?: boolean
    onRequest?: () => void
    onResponse?: (res?: any) => void
    onResponseError?: (err?: any) => void
}