import { getUsersByQuery, updateUserById } from '@/server/directus/users'
import { readEvent } from '@/server/apiUtils/readEvent'
import { setNewBadgeRecord } from '@/server/badges/badges'

export default defineEventHandler(async (
    event
) : Promise<ApiResponse<undefined>> => 
{

    const { body, error } = await readEvent(event, [ 'body']);

    if(error) return error

    const user = await getUserWithEmail(body.email)
    
    if(!user) {
        return newResponse({
            ok: false,
            status: 404,
            statusText: 'email not found'
        })
    }

    if(!tokensAreValid(
        body.token,
        user.email_verification_token
    )){
        return newResponse({
            ok: false,
            status: 400,
            statusText: 'token invalid'
        })
    }

    const userSuccesfullyUpdated = await updateUser(user)

    if(!userSuccesfullyUpdated) {
        return newResponse({
            ok: false,
            status: 500,
            statusText: 'user not updated'
        })
    }

    return newResponse({
        ok: true,
        status: 200,
        statusText: 'email verified'
    })
})

interface UserFromEmail {
    // based on the query in the getUserWithEmail function
    id: string,
    email: string,
    email_verification_token: string
}

async function getUserWithEmail(
    email: string
): Promise<UserFromEmail | null> {

    const user = await getUsersByQuery<UserFromEmail>({
        auth: 'app',
        query: {
            filter: {
                email: {
                    _eq: email
                }
            },
            fields: 'id,email,email_verification_token'
        }
    })

    if(!user.ok || !user.data?.length) {
        console.error('Error fetching user:', user.statusText)
        return null
    }
    return user.data[0]
}

function tokensAreValid(
    tokenFromRoute: unknown,
    tokenFromDirectus: unknown
) : boolean {

    if (
        typeof tokenFromRoute !== 'string' ||
        typeof tokenFromDirectus !== 'string'
    ) {
        console.error('Invalid token: token must be a string.')
        return false
    }

    if (
        !tokenFromRoute.trim() ||
        !tokenFromDirectus.trim()
    ) {
        console.error('Invalid token from route: token cannot be empty or whitespace-only.')
        return false
    }

    return tokenFromRoute === tokenFromDirectus;
}

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
    activityRecord: {
        user: string;
    };
    personalDataRecord: {
        user: string;
    }
} | undefined;


async function updateUser(
    user: any
): Promise<'success' | undefined> {

    const res = await updateUserById<any>({
        id: user.id,
        auth: 'app',
        body: {
            email_verified: true,
            role: useRuntimeConfig().USER_ROLE_ID,
            badgeRecord: {
                firstBeliever:  "level1",
                betaTester: "level1",
                user: user.id
            },
            activityRecord: {
                user: user.id
            },
            personalDataRecord: {
                user: user.id,
                email: {
                    key: "email",
                    value: user.email,
                    user: user.id,
                    public: false
                }
            }
        },
        query: {
            fields: 'id,email,email_verified,role',
        },
    })

    if (!res.ok || !res.data) {
        console.error('Failed to update user:', res.statusText);
        return
    }

    if (
        res.data.email_verified && 
        res.data.role === useRuntimeConfig().USER_ROLE_ID
    ) {
        return 'success'
    }
    console.error('Failed to update user in /auth/verify-email.post.ts', res);
    return
}
