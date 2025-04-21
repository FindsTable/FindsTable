import { readEvent } from '@/server/apiUtils/readEvent'
import {
    configureVerifiedAccount
} from '@/server/utils/apiAuthSignupUtils'
import { 
    validateUserEmail, 
    tokensAreValid 
} from '@/server/utils/validation'

export default defineEventHandler(async (
    event
) : Promise<ApiResponse<undefined>> => 
{

    const { body, error } = await readEvent(event, ['body']);

    if(error) return error

    const validatedUser = await validateUserEmail(body.email)
    
    if(!validatedUser) {
        return newResponse({
            ok: false,
            status: 404,
            statusText: 'email not found'
        })
    }

    if(!tokensAreValid(
        body.token,
        validatedUser.email_verification_token
    )){
        return newResponse({
            ok: false,
            status: 400,
            statusText: 'token invalid'
        })
    }

    /*
    *  Create dataRecord, dataValues, badgeRecord, update userObject
    */
    const accountConfigured = await configureVerifiedAccount(validatedUser)

    if(accountConfigured.error) {
        return newResponse({
            ok: false,
            status: 500,
            statusText: accountConfigured.error,
            data: accountConfigured
        })
    }
    return newResponse({
        ok: true,
        status: 200,
        statusText: 'email verified',
        data: accountConfigured
    })
})


type UpdatedUser = {
    // based on the query in the updateUser function
    id: string;
    email: string;
    email_verified: boolean;
    role: string;
    badgeRecord: {
        firstBeliever: string;
        betaTester: string;
        user: string;
    };
    personalDataRecord: {
        user: string;
    }
} | undefined;