import crypto from 'crypto'

import {
    invitationCodeIsValid
} from '@@/server/directus/invitationCodes'

import {
    appPost
} from '@@/server/directus/request'

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
}

export default defineEventHandler( async (
    event: H3Event
): 
    Promise<EndpointReturnData> =>
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

    } catch(err : any) {
        throw newError({
            code: 400,
            message: "Bad request",
            reason: err.message
        })
    }
    
    await invitationCodeIsValid(body.code);
    assertStrongEquality(
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
    
    if(!newUser) {
        throw newError({
            code: 505,
            message: "Request failed",
            reason: "Could not create user"
        })
    }

    return newUser
});