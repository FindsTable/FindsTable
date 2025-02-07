export default defineEventHandler((event) => {

    /*
    Set the response header for accepting the prefered color scheme
    from compatible browsers.
    https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-CH-Prefers-Color-Scheme
    */

    // filter out api calls
    if (event.node.req.url.includes('/api')) {
        return
    }
    // should not run everytime, we need to check if it is already set
    event.node.res.setHeader('accept-ch', 'Sec-CH-Prefers-Color-Scheme')
})