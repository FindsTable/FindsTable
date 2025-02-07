export default defineEventHandler(async (event) => {

    interface Body {
        newColorMode: string;
    }

    const body : Body = await readBody(event);

    if (!body.newColorMode) {
        throw new Error("newColorMode property is missing");
    }

    setCookie( 
            event, 
            'colorMode', 
            body.newColorMode,
        {
            httpOnly: false,
            secure: true,
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 365,
        }
    )

    return {
        message: 'Color mode updated',
        status: 200
    };
})