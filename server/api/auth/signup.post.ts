import { getItemsByQuery } from '@/server/directus/items'
import { createUser } from '@/server/directus/auth'
import crypto from 'crypto'

interface ReqBody {
    username: string
    email: string
    password: string
    passwordConfirmation: string
    invitation_code: string
}

export default defineEventHandler( async (
    event: H3Event
): 
    Promise<ApiResponse<{email: string} | null>> =>
{

    const reqBody: ReqBody = await readBody(event)

    if(!reqBody) {
        
        return newResponse({
            ok: false,
            status: 400,
            statusText: 'Bad Request, no req body',
            data: null,
            feedback: {
                toaster: {
                    messagePath: 'error.global.somethingWentWrong',
                    type: 'warning'
                }
            }
        })
    }
    const code = reqBody.invitation_code

    if(!code) {
        return newResponse({
            ok: false,
            status: 403,
            statusText: 'Unauthorized, no invitation code provided',
            data: null,
            feedback: {
                toaster: {
                    messagePath: 'error.auth.invitationCode.missing',
                    type: 'warning',
                }
            }
        })
    }

    if (!passwordsIdentical(
        reqBody.password, 
        reqBody.passwordConfirmation)
    ) {
        return newResponse({
            ok: false,
            status: 403,
            statusText: 'Passwords do not match',
            data: null,
            feedback: {
                toaster: {
                    messagePath: "error.auth.passwordsNotIdentical",
                    type: 'warning'
                }
            }
        })
    }

    if (await codeIsValid(code) === false) {
        return newResponse({
            ok: false,
            status: 403,
            statusText: 'Unauthorized, code is invalid',
            data: null,
            feedback: {
                toaster: {
                    messagePath: 'error.auth.invitationCode.invalid',
                    type: 'warning'
                }
            }
        })
    }

    const emailVerificationToken = crypto.randomBytes(16).toString('hex')
    
    const res = await createUser<{
        email: string
    }>({
        body: {
            username: `@${reqBody.username}`,
            email: reqBody.email,
            password: reqBody.password,
            invitation_code: reqBody.invitation_code,
            email_verification_token: emailVerificationToken
        },
        query: {
            fields: 'email,id'
        }
    })
    
    return res
})

async function codeIsValid(
    code: string
)
    : Promise<boolean>
{

    let res = await getItemsByQuery<{
        id: string
    }>({
        collection: 'Invitation_codes',
        auth: 'app',
        query: {
            fields: 'id',
            filter: {
                _and: [
                    {
                        id: {
                            _eq: code
                        }
                    },
                    {
                        usedBy: {
                            _eq: null
                        }
                    }
                ]
            }
        }
    })  

    if(!res.ok) {
        console.error(`/signup => Problem fetching a valid invitation code`, res)
    }
    
    return res.ok
}

function passwordsIdentical(
    password: string, 
    passwordConfirmation: string
): boolean {
    return password === passwordConfirmation
}