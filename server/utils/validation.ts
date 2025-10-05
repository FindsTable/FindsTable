import { 
    getMe,
    getUsersByQuery
 } from '@@/server/directus/users'

import { appGet } from '@@/server/directus/request'

export {
    itemCountIsValid,
    validateUser,
    validateUserEmail,
    tokensAreValid,
    isValidImageType,
    validateImageType,
    getItemCount,
    userIsValid,
    assertItemCount
}
interface MaxItemCount {
    [key : string ] : number
}

const maxItemCount : MaxItemCount = {
    "Finds": 6,
    "Thoughts": 3,
    "Thoughts_comments": 100,
    "Finds_comments": 100,
    "Avatars": 25,
    "All_comments": 1000,
    "Hunt-reports": 5
}

async function getItemCount(p : {
    userId: string
    collection: string
}) : Promise<number>{

    const res = await appGet<[ { count : number } ]>({
        endpoint: `/items/${p.collection}`,
        query: {
            filter: {
                owner: {
                    _eq: p.userId
                }
            },
            aggregate: { 
                count: '*' 
            }
        }
    })
    return res[0].count
}

async function assertItemCount(p : { 
    collection: string
    userId: string
}) : Promise<void> {

    const count = await getItemCount(p)

    if(count > maxItemCount[p.collection]) {
        throw toasterError({
            code: 403,
            message: "Unauthorized",
            reason: `Too many items in ${p.collection} : ${count}`,
            toasterPath: "error.tooManyItems"
        });
    }
}

async function itemCountIsValid(p : { 
    collection: string
    userId: string
}) : Promise<void> {

    const count = await getItemCount(p)
    
    if(count > maxItemCount[p.collection]) {
        throw toasterError({
            code: 403,
            message: "Unauthorized",
            reason: `Too many items in ${p.collection} : ${count}`,
            toasterPath: "error.tooManyItems"
        });
    }
}

async function userIsValid(bearerToken : string) {
    try {
        const me = await getMe({
            bearerToken: bearerToken,
            query: {
                fields: 'id'
            }
        })

        if(!me.data?.id) {
            throw newError({
                code: 403,
                reason: "User is not valid",
                message: "Unauthorized",
            })
        }
        return me.data.id
    } catch(err : any) {
        throw newError({
            code: err.statusCode ?? 500,
            message: err.message ?? "Unknown error",
            reason: "Something went wrong while validating user",
        });
    }
}

function validateImageType(type : string) {
    if(type !== 'image/jpg' && type !== 'image/png' && type !== 'image/webp') {
        throw newError({
            code: 400,
            message: 'Bad request',
            reason: 'Image type is not valid'
        })
    }
}


async function validateUser( p : {
    bearerToken: string,
    fields? : string[]
}): Promise<UserObject | undefined> {

    const { data } = await getMe({
        bearerToken: p.bearerToken,
        query: {
            fields: p.fields ? p.fields.join(',') : 'id'
        }
    })

    return data ? data : undefined
}

interface UserFromEmail {
    id: string,
    email: string,
    email_verification_token: string
}

/*
*    validateUserEmail()
*
*    Used to verify the email in the signup process.
*    It returns a partial user object
*
*/
async function validateUserEmail(
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

    if(!user || !user.ok) {
        console.error('Error fetching user:', user.statusText)
        return null
    }

    if(!user.data?.length) {
        console.error('No user found with this email:', user.statusText)
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

function isValidImageType(mimeType?: string): boolean {
    if (!mimeType) return false

    const allowedTypes = ['image/webp']
    return allowedTypes.includes(mimeType)
}