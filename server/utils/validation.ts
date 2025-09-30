import { 
    getMe,
    getUsersByQuery
 } from '@@/server/directus/users'
import { ImageFormatPresetKey } from '#shared/types/files'


export {
    itemCountIsValid,
    validateUser,
    validateUserEmail,
    tokensAreValid,
    isValidImageType
}
interface MaxItemCount {
    [key : string ] : number
}

const maxItemCount : MaxItemCount = {
    "Finds": 6,
    "Thoughts": 10,
    "Thoughts_comments": 100,
    "Finds_comments": 100,
    "Avatars": 25,
    "All_comments": 1000,
    "Hunt-reports": 5
}

function itemCountIsValid(p : { 
    collection: string,
    items_count?: number
}) : boolean {

    if( typeof p.items_count !== 'number') {
        console.log('items_count is not a number')
        return true
    }

    return p.items_count < maxItemCount[p.collection]
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

function validateImage( p : {
    preset : ImageFormatPresetKey,
    image: File
}) : boolean {

    p.image.type === p.preset.mimeType

    return true
}