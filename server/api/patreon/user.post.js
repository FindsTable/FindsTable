/*
SHOULD BE RENAMED TO "WEBHOOK"

This endpoint receives webhook calls from Patreon

Request come with a signature that need to be validated
All requests ares logged to Netlify for reccords
*/


import {
    patreonSignatureIsValid,
    logWebhookToNetlify
} from '../../patreon/utils.js';

export default defineEventHandler(async (event) => {

    const headers = getRequestHeaders(event);

    const contentSize = Number(headers['content-length']);

    if (!contentSize) {
        console.log("error: ", 'No content size present');
        setResponseStatus(event, 403, "Forbidden");
        event.node.res.end();
        return
    }
    if(contentSize > 1048576) {
        console.log("error: ", 'Content too large');
        setResponseStatus(event, 413, "Payload too large");
        event.node.res.end();
        return
    }
    const signature = headers['x-patreon-signature'];
    if (!signature) {
        console.log("error: ", 'No signature present');
        setResponseStatus(event, 403, "Forbidden");
        event.node.res.end();
    }

    const rawBody = await readRawBody(event);

    if (!patreonSignatureIsValid(signature, rawBody)) {
        console.log("error: ", 'Invalid signature');
        setResponseStatus(event, 403, "Forbidden");
        event.node.res.end();
    }

    const body = JSON.parse(rawBody.toString());

    logWebhookToNetlify(headers, body);
    
    setResponseStatus(event, 200, "OK");
    event.node.res.end();
})
