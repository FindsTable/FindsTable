import { directusAPI } from './main'
import { ApiResponse } from '#shared/types/apiResponse'

export {
    queryRoles
}

async function queryRoles<
    ExpectedRoleObject extends RoleObject
>(
    query: any
):
    Promise<ApiResponse<ExpectedRoleObject[] | null
>> 
{
    const users = await directusAPI({
        endPoint: '/roles',
        method: 'GET',
        auth: 'app',
        query
    })

    return users
}
