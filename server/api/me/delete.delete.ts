import { readEvent } from '@/server/apiUtils/readEvent'
import { ApiResponse } from '#shared/types/apiResponse'
import { validateUser } from '@/server/utils/validation'

export default defineEventHandler(async (
    event: H3Event
)
    : Promise<
        ApiResponse<null>
    > => {

    const {
        bearerToken,
        body,
        error
    } = await readEvent(event, ['bearerToken', 'body'])

    if (error) return error

    const currentUser = await validateUser({
        bearerToken: bearerToken!,
        fields: [
            'id'
        ]
    })

    

    if(!currentUser || !currentUser.id) {
        return newResponse({
            ok: false,
            status: 403,
            statusText: "User is not logged in",
            data: null,
            feedback: {
                toaster: {
                    messagePath: "error.cuserNotLoggedIn",
                    message: "User is not logged in",
                    type: "error"
                }
            }
        })
    }
    

    if(body.confirmation !== body.username) { // user needs to confirm their username for security
        return newResponse({
            ok: false,
            status: 403,
            statusText: "Invalid confirmation code",
            data: null,
            feedback: {
                toaster: {
                    messagePath: "error.confirmationInvalid",
                    message: "Invalid confirmation code",
                    type: "error"
                }
            }
        })
    }

    const res = await $fetch(
        `https://admin.findstable.net/users/${currentUser.id}`,
        {
            method: 'DELETE',
            headers: {
                authorization: `Bearer EEy6M6_k90rcs_wOb3SGZHZbbl3tZTal`
            }
        }
    )

    if(res) {
        return newResponse({
            ok: false,
            status: 200,
            statusText: "Account deleted",
            data: null,
            feedback: {
                toaster: {
                    messagePath: "success.accountDeleted",
                    message: "Thanks for the time you've spent with us ! :-)",
                    type: "success"
                }
            }
        })
    }

    return newResponse({
        ok: false,
        status: 300,
        statusText: "Something went wrong",
        data: null,
        feedback: {
            toaster: {
                messagePath: "user.problem.notDeleted",
                message: "No response from directus /users/id => .delete",
                type: "success"
            }
        }
    })
})