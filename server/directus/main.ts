export {
    directusAPI,
    DirectusAPIParams
}

const runtimeConfig = useRuntimeConfig();


async function directusAPI (

    params: DirectusAPIParams

):
    Promise<any>
{  
    const options = parseOptions(params);

    const TIMEOUT_DURATION = 3000

    const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Request timed out')), TIMEOUT_DURATION)
    );

    try {
        const res: any = await Promise.race([
            $fetch(
                `${runtimeConfig.DIRECTUS_URL}${params.endPoint}`, 
                options
            ),
            timeoutPromise
        ])

        //delete returns res === undefined
        if(options.method === "DELETE") {
            return {
                ok: true,
                status: 200,
                statusText: 'OK'
            }
        }

        if(res.data) {
            return {
                ok: true,
                status: 200,
                statusText: 'OK',
                data: res.data
            }
        }

        return {
            ok: true,
            status: 200,
            statusText: 'OK'
        }

    } catch (error: any) {
        console.error('server/directus/main => ', error)
        return {
            ok: false,
            status: error.response?.status || 500,
            statusText: error.message || 'Internal Server Error'
        }
    }
}



function parseOptions(params: DirectusAPIParams ) {
    if (!params.method) throw new Error('Method is required')
    if (!params.auth) throw new Error('Auth is required')

    const options: $FetchOptions = {
        throw: false,
        method: params.method
    }
    if(params.query) options.query = params.query
    if(params.body) options.body = params.body
    if(params.auth !== 'public') options.headers = {
        'uthorization': setAuthorizationHeader(params.auth)
    }
    return options
}

function setAuthorizationHeader(auth: DirectusAPIParams['auth']): BearerToken | undefined {

    if (auth === 'app') return `Bearer ${runtimeConfig.APP_ACCESS_TOKEN}`;
    if (auth === 'public') return undefined;
    if (typeof auth === 'string' && auth.startsWith('Bearer ')) return auth;
    throw new Error('Invalid auth value');
}

interface DirectusAPIParams {
    endPoint: any,
    method: any,
    auth: 'app' | BearerToken | 'public' | string,
    contentType?: any,
    body?: Body | any,
    query?: any,
    caller?: string  // !! I can't remeber what the idea was !!
}

interface $FetchOptions {
    throw: boolean
    method: any
    headers?: Headers
    query?: any
    body?: Body | any
}