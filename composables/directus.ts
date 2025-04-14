/*
*
*   Direct request to the database when data validation is not needed
* 
* */

export { useDirectFetch }


function useDirectFetch<T>(
    _method: 'GET' | 'POST' | 'DELETE',
    _path: string,
    _options?: Options
  ) {
    const response = ref<T | null>(null)
    const error = ref<Record<string, any> | null>(null)
    const isPending = ref(false)
  
    /*
        Pass params when called directly, otherwhize it uses the params from useDirectFetch
    */
    async function directFetch(
        method: 'GET' | 'POST' | 'DELETE' = _method,
        path: string = _path,
        options: Options = _options
    ) {

        await $fetch<DirectusResponse<T>>(`${useAppConfig().directusUrl}${path}`, {
            method,
            headers: {
                authorization: `Bearer ${useUserState().value.accessToken.value}`
            },
            ...options,
            onRequest: () => {
                isPending.value = true
                if(options?.onRequest) {
                    options.onRequest()
                }
            },
            onResponse: (res) => {
                response.value = res.response._data.data || null
                if(options?.onResponse) {
                    options.onResponse()
                }
                isPending.value = false
            },
            onResponseError: (err) => {
                error.value = err.response?._data || { message: 'Unknown error' }
                if(options?.onResponseError) {
                    options.onResponseError()
                }
                isPending.value = false
            }
        })
    }
  
    async function refresh() {
      directFetch()
    }
  
    if (!_options?.differed) {
      directFetch()
    }
  
    return {
      response,
      error,
      isPending,
      refresh,
      directFetch
    }
  }
  

type DirectusResponse<T> = {
  data: T
  meta?: any
}

type Options = 
    undefined |
    {
        body?: Record<string, any>
        query?: Record<string, string | number | boolean>
        differed?: boolean | undefined
        onRequest?: Function
        onResponse?: Function
        onResponseError?: Function
    }