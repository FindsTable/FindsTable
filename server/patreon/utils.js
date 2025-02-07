import crypto from 'crypto';

export {
    patreonSignatureIsValid,
    logWebhookToNetlify
}

const runtimeConfig = useRuntimeConfig();
const APP_ACCESS_TOKEN = runtimeConfig.APP_ACCESS_TOKEN;
const PATREON_WEBHOOKS_SECRET = runtimeConfig.PATREON_WEBHOOKS_SECRET;



async function patreonSignatureIsValid(signature, rawBody) {

    const computedSignature = crypto
        .createHmac('md5', PATREON_WEBHOOKS_SECRET)
        .update(rawBody)
        .digest('hex');

    const isValid = crypto.timingSafeEqual(
        Buffer.from(computedSignature, 'utf8'),
        Buffer.from(signature, 'utf8')
    );

    return isValid;
}

async function logWebhookToNetlify(headers, parsedBody) {

    const body= {
        event: headers['x-patreon-event'],
        full_name: parsedBody.data.attributes.full_name
    }

    const response = await $fetch(
        `${runtimeConfig.DIRECTUS_URL}/items/Patreon_webhook_logs`,
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${APP_ACCESS_TOKEN}`
            },
            body: JSON.stringify(body)
        }
    );
}