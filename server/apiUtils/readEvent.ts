export type ReadEventOption = 'body' | 'query' | 'bearerToken' | `param${string}` | `header${string}`
export type ReadEventOptions = ReadEventOption[]

export type ReadEventResult = {
    body: any
    query: Record<string, any>
    params: Record<string, string>
    headers: Record<string, string>
    bearerToken: string
    error?: ApiResponse<any>
}

export async function readEvent(
    event: H3Event,
    options: ReadEventOptions
): Promise<ReadEventResult> {
    
    const result: ReadEventResult = {
        body: {},
        query: {},
        params: {},
        headers: {},
        bearerToken: '',
    }

    try {
        for (const option of options) {
            if (option === 'body') {
                await handleBody(event, result)
            } else if (option === 'query') {
                handleQuery(event, result)
            } else if (option === 'bearerToken') {
                handleBearerToken(event, result)
            } else if (option.startsWith('param')) {
                handleParam(event, result, option)
            } else if (option.startsWith('header')) {
                handleHeader(event, result, option)
            }
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            result.error = newResponse({
                ok: false,
                status: 400,
                statusText: error.message,
            })
        } else {
            result.error = newResponse({
                ok: false,
                status: 400,
                statusText: 'Unknown error in readEvent'
            })
        }
    }

    return result
}

async function handleBody(event: H3Event, result: ReadEventResult) {
    try {
        result.body = await readBody(event)
    } catch (error) {
        throw new Error('Failed to read body')
    }
}

function handleQuery(event: H3Event, result: ReadEventResult) {
    try {
        result.query = getQuery(event)
    } catch (error) {
        throw new Error('Failed to read query')
    }
}

function handleBearerToken(event: H3Event, result: ReadEventResult) {
    const bearerToken = getHeader(event, 'Authorization')

    if (!bearerToken || typeof bearerToken !== 'string') {
        throw new Error('Authorization header is missing or invalid')
    }

    result.bearerToken = bearerToken
}

function handleParam(event: H3Event, result: ReadEventResult, option: string) {
    const paramName = option.slice(5).toLowerCase()
    const params = getRouterParams(event)

    if (!params[paramName]) {
        throw new Error(`Parameter ${paramName} is missing, have ${paramName} instead`)
    }
    result.params[paramName] = params[paramName]
}

function handleHeader(event: H3Event, result: ReadEventResult, option: string) {
    const headerName = option.slice(6).toLowerCase()
    const headerValue = getHeader(event, headerName)

    if (!headerValue) {
        throw new Error(`Header ${headerName} is missing`)
    }
    result.headers[headerName] = headerValue
}
