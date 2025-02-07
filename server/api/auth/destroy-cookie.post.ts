export default defineEventHandler(async (
    event
): 
    Promise<ApiResponse<undefined>> => 
{

    const body = await readBody(event);
    const name = body.name

    if(!name) {
        return newResponse({
            ok: false,
            status: 400,
            statusText: 'Bad request, name missing from body'
        })
    }

    const cookie = getCookie(
        event, 
        `${name}`
    )

    if(!cookie) {
        return newResponse({
            ok: false,
            status: 404,
            statusText: 'No cookie found'
        })
    }

    setCookie(
        event,
        name,
        "null",
        {
            httpOnly: true,
            path: '/',
            maxAge: 0,
            sameSite: 'strict',
            secure: true
        }
    )

    return newResponse({
        ok: true,
        status: 200,
        statusText: 'Cookie destroyed'
    })
})