import { updateUserById } from '@@/server/directus/users'
import { createItem, updateItemById } from '@@/server/directus/items'
import { appPost, appPatch } from '@@/server/directus/request'
export {
    configureVerifiedAccount
}

async function configureVerifiedAccount(
    user : {
        id: string,
        email: string,
        email_verification_token: string
    }
) : Promise<void> {

    await createPersonalDataRecord(user.id)

    await createPersonalDataValues(user.id, user.email)

    await createBadgeRecord(user.id)

    await updateUser(user)
}


async function updateUser(
    user: any
): Promise<void> {

    try {
        await appPatch({
            endpointId: `/users/${user.id}`,
            body: {
                email_verified: true,
                role: useRuntimeConfig().USER_ROLE_ID
            },
            query: {
                fields: 'id,email,email_verified,role',
            },
        })
    } catch(err) {
        throw newError({
            code: 400,
            message: 'Bad request',
            reason: 'Could not update user'
        })
    }
}

async function createPersonalDataRecord(
    userID : string
) : Promise<void> {

    try {
        await appPost({
            endpoint: '/items/PersonalData_record',
            body: {
                id: userID, // records and user share the same id
                user: userID,
            },
            query: {
                fields: 'id'
            }
        })
    } catch(err) {
        throw newError({
            code: 400,
            message: 'Bad request',
            reason: 'Could not create personal data record'
        })
    }
}

async function createPersonalDataValues(
    userId : string, 
    userEmail : string
)  : Promise<void> {

    try {
       await appPatch({
            endpointId: `/items/PersonalData_record/${userId}`,
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
    } catch(err) {
        throw newError({
            code: 400,
            message: 'Bad request',
            reason: 'Could not update personal data record'
        })
    }
}

async function createBadgeRecord(
    userId : string
) : Promise<void> {
    try {
        await appPost({
        endpoint: 'Badge_records',
        body: {
            id: userId, // records and users share the same id
            owner: userId,
        },
        query: {
            fields: 'id'
        }
    })
    } catch(err) {
        throw newError({
            code: 400,
            message: 'Bad request',
            reason: 'Could not create badge record'
        })
    }
}

function newBadges(userId : string) {
    return [
        {
            badge: 'firstBeliever',
            owner: userId,
            level: 'firstBeliever_1'
        },
        {
            badge: 'betaTester',
            owner: userId,
            level: 'betaTester_1'
        }
    ]
}

async function createBadges(userId : string) {
    const res = await createItem<{id: string}>({
        collection: 'User_badges',
        auth: 'app',
        body: newBadges(userId),
        query: {
            fields: 'id'
        }
    })

    return res?.data ? res.data : undefined

}