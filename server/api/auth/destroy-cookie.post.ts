export default defineEventHandler(async (
    event
): 
    Promise<void> => 
{
    const body = await readBody(event);
    const name = body.name

    if(!name) throw newError({
        code: 400,
        message: 'Bad request',
        reason: 'Missing name of cookie to be destroyed'
    })

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
})