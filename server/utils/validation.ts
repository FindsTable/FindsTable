import { getMe } from '@/server/directus/users'

export {
    itemCountIsValid,
    validateUser
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
    "All_comments": 1000
}

function itemCountIsValid(p : { 
    collection: string,
    items_count?: number
}) : boolean {

    if( typeof p.items_count !== 'number') {
        console.log('items_count is not a number')
        return false
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
