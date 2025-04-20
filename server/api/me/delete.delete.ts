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

    const app = await $fetch(
        `https://admin.findstable.net/users/me`,
        {
            method: 'GET',
            headers: {
                authorization: `Bearer Tggg0bTu-9rLyw3f6NJFj8PBLLEprTJT`
            },
            query: {
                fields: [
                    'id'
                ]
            }
        }
    )

    try {
        const res = await $fetch(
          `https://admin.findstable.net/users/${currentUser.id}`,
          {
            method: 'DELETE',
            headers: {
              authorization: `Bearer Tggg0bTu-9rLyw3f6NJFj8PBLLEprTJT`
            }
          }
        )
        return {
          ok: true,
          deleteRes: res
        }
      } catch (err: any) {
        console.error('FetchError:', err)
      
        return {
          ok: false,
          deleteError: {
            name: err.name,
            message: err.message,
            statusCode: err?.response?.status,
            statusText: err?.response?.statusText,
            data: err?.response?._data || null,
            full: JSON.stringify(err, Object.getOwnPropertyNames(err), 2)
          }
        }
      }
    
    if(res) {
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