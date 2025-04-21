import { updateUserById } from '@/server/directus/users'
import { createItem, updateItemById } from '@/server/directus/items'

export {
    configureVerifiedAccount
}

async function configureVerifiedAccount(
    user : {
        id: string,
        email: string,
        email_verification_token: string
    }
) : Promise<any> {

    const res = {
        error: '',
        dataRecord: undefined,
        dataValues: undefined,
        updatedUser: undefined
    }

    res.dataRecord = await createPersonalDataRecord(user.id)
    if( !res.dataRecord ) {
        res.error = 'Could not create personal data record'
        return res
    }

    res.dataValues = await createPersonalDataValues(user.id, user.email)
    if( !res.dataValues )  {
        res.error = 'Could not create personal data values'
        return res
    }

    res.updatedUser = await updateUser(user)
    if( !res.updatedUser )  {
        res.error = 'Could not update user object'
        return res
    }

    return res
}

async function updateUser(
    user: any
): Promise<any> {

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
            }
        },
        query: {
            fields: 'id,email,email_verified,role',
        },
    })

    if (!res.ok || !res.data) {
        console.error('Failed to update user:', res.statusText);
        return undefined
    }

    if (
        res.data.id &&
        res.data.email_verified && 
        res.data.role === useRuntimeConfig().USER_ROLE_ID
    ) {
        return res.data
    }
    console.error('Failed to update user in /auth/verify-email.post.ts', res);
    return undefined
}



async function createPersonalDataRecord(
    userID : string
) : Promise<any> {

    const res = await createItem<{id: string}>({
        collection: 'PersonalData_record',
        auth: 'app',
        body: {
            id: userID, // records and user share the same id
            user: userID,
        },
        query: {
            fields: 'id'
        }
    })

    console.log(res)
    return res?.data ? res.data : undefined
}

async function createPersonalDataValues(
    userId : string, 
    userEmail : string
)  : Promise<any> {
    const res = await updateItemById({
        id: userId,
        collection: 'PersonalData_record',
        auth: 'app',
        body: {
            email: {
                id: `${userId}-email`,
                key: "email",
                value: userEmail,
                record: userId,
                isPublic: false
            },
            firstName: {
                id: `${userId}-firstName`,
                key: "firstName",
                value: "",
                record: userId,
                isPublic: false
            },
            lastName: {
                id: `${userId}-lastName`,
                key: "lastName",
                value: "",
                record: userId,
                isPublic: false
            },
            country: {
                id: `${userId}-country`,
                key: "country",
                value: "",
                record: userId,
                isPublic: false
            }
        }
    })

    return res?.data ? res.data : undefined
}