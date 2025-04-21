export {
    useDirectAsyncFetch,
    useDirectFetch
}

function useDirectAsyncFetch<T = any>(
    method: Method,
    path: string,
    options?: Options
): UseDirectFetchReturn<T> {
    const response = ref<T | null>(null) as Ref<T | null>
    const error = ref<Record<string, any> | null>(null)
    const isPending = ref(false)
  
    async function directFetch(
        method: Method,
        path: string,
        options?: Options
    ) {

        isPending.value = true
        await $fetch<DirectusResponse<T>>(
            
            `${useAppConfig().directusUrl}${path}`, 
            {
                method,
                headers: {
                    authorization: `Bearer ${useUserState().value.accessToken.value}`
                },
                ...options,
                onRequest: () => {
                    isPending.value = true
                    options?.onRequest?.()
                },
                onResponse: (res) => {
                    const data: any = res?.response?._data?.data || null

                    if (Array.isArray(data)) {
                        response.value = options?.singleItem ? data[0] : data
                    } else {
                        response.value = data
                    }

                    options?.onResponse?.(response)
                    isPending.value = false
                },
                onResponseError: (err) => {
                    error.value = err.response?._data || { message: 'Unknown error' }
                    options?.onResponseError?.()
                    isPending.value = false
                }
            }
        )
        return response.value
    }

    async function differedFetch() {
        if (isPending.value) {
            directFetch(
                method,
                path,
                options
            )
        }
    }

    async function refresh(): Promise<T | null> {
        if (isPending.value) {
            return response.value
        }
        return directFetch(
            method,
            path,
            options
        )
    }

    if (!options?.differed) {
        directFetch(
            method,
            path,
            options
        )
    }
  
    return {
      response,
      error,
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
     * Trigger a fresh fetch and get the new data (or null on error)
     */
    refresh: () => Promise<T | null>
    /**
     * Perform a fetch with optional overrides and return the data
     */
    differedFetch: (
        method?: Method,
        path?: string,
        options?: Options
    ) => Promise<T | null>
}

// Shape of Directus standard response
export type DirectusResponse<T> = {
  data: T
  meta?: any
}

// HTTP methods supported by Directus
export type Method = 'GET' | 'POST' | 'DELETE' | 'PATCH'

// Options for each fetch call
export type Options = {
    body?: any
    query?: any
    differed?: boolean
    singleItem?: boolean
    onRequest?: () => void
    onResponse?: (res? : any) => void
    onResponseError?: (err? : any) => void
}
