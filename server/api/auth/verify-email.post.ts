import {
    configureVerifiedAccount
} from '@@/server/utils/apiAuthSignupUtils'
import { assertTokensAreValid } from '@@/server/utils/validation'
import { appGet } from '@@/server/directus/request'

export default defineEventHandler(async (
    event
) : Promise<any> => 
{
    const body = await readBody(event)

    if(!body) throw newError({
        code: 400,
        message: 'Bad request',
        reason: 'No body in request'
    })

    const users = await appGet<{
        id: string,
        email: string,
        email_verification_token: string
    }[]>({
        endpoint: `/users/`,
        query: {
            filter: {
                email_verification_token: {
                    _eq: body.token
                }
            },
            fields: 'id,email,email_verification_token'
        }
    })

    /*
    *  Create dataRecord, dataValues, badgeRecord, update userObject
    */

    await configureVerifiedAccount(users[0])
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