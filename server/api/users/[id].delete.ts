import { readEvent } from '@@/server/apiUtils/readEvent'
import { ApiResponse } from '#shared/types/apiResponse'
import { directusAPI } from '@@/server/directus/main'

export default defineEventHandler(async <
    Data extends UserObject
>(
    event: H3Event
)
    : Promise<
        ApiResponse<null>
    > => {

    const {
        bearerToken,
        id,
        body,
        error
    } = await readEvent(event, ['bearerToken', 'paramId', 'body'])

    if (error) return error

    if(body.confirmation !== body.username) {
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

    const res = await directusAPI({
        endPoint: `/users/${id}`,
        method: 'DELETE',
        auth: bearerToken
    })

    if(res?.ok) {
        return newResponse({
            ok: true,
            status: 200,
            statusText: "User deleted",
            data: null,
            feedback: {
                toaster: {
                    messagePath: "user.deleted",
                    message: "The user was succesfuly deleted",
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