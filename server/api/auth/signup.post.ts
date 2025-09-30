import crypto from 'crypto'

import {
    invitationCodeIsValid
} from '@/server/directus/invitationCodes'

import {
    appPost
} from '@/server/directus/request'

interface ReqBody {
    username: string
    email: string
    password: string
    passwordConfirmation: string
    invitation_code: string
}

type EndpointReturnData = {
    email: string, 
    id: string
} | null

export default defineEventHandler( async (
    event: H3Event
): 
    Promise<ApiResponse<EndpointReturnData>> =>
{

    try {
        const reqBody: ReqBody = await readBody(event);

        const code = reqBody.invitation_code;
        if(!code) throw new Error('No invitation code in request');

        const username = reqBody.username;
        if(!username) throw new Error('No username in request');

        const email = reqBody.email;
        if(!email) throw new Error('No email in request');

        const password = reqBody.password;
        if(!password) throw new Error('No password in request');

        const passwordConfirmation = reqBody.passwordConfirmation;
        if(!passwordConfirmation) throw new Error('No passwordConfirmation in request');
        
        var body = {
            email, password, passwordConfirmation, code, username
        }
        
    } catch(err) {
        throw new Error('/auth/signup => basic validation failed')
    }


    
    
    // email and username should be unique in Directus, so no need to verify here
    await invitationCodeIsValid(body.code);
    passwordsIdentical(
        body.password, 
        body.passwordConfirmation
    )

    const newUser = await appPost<{email: string, id: string}>({
        endpoint: '/users',
        body: {
            username: `@${body.username}`,
            email: body.email,
            password: body.password,
            email_verification_token: crypto.randomBytes(16).toString('hex'),
            invitation_code: body.code,
            status: "unverified"
        },
        query: {
            fields: 'id,email'
        }
    })

    return newUser
});

function passwordsIdentical(
    password: string, 
    passwordConfirmation: string
): void {
    if(password !== passwordConfirmation) {
        throw createError({
            statusCode: 400,
            statusMessage: "Bad request",
            data: {
                reason: "Passwords are not identical",
                toasterPath: "error.auth.passwordsNotIdentical"
            }
        });
    }
};