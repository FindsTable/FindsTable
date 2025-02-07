export default defineEventHandler(async (
    event
): 
    Promise<ApiResponse<undefined>> => 
{

    const query = getQuery(event)
    
    if(!query) {
        return newResponse({
            ok: false,
            status: 400,
            statusText: 'Bad Request'
        })
    }

    const cookieName = query.cookieName

    if(!cookieName) {
        return newResponse({
            ok: false,
            status: 400,
            statusText: 'Bad Request'
        })
    }

    const cookie = getCookie(
        event, 
        `${cookieName}`
    )

    if(cookie) {
        return newResponse({
            ok: true,
            status: 200,
            statusText: 'OK'
        })
    }
    return newResponse({
        ok: false,
        status: 404,
        statusText: 'Not found'
    })
})