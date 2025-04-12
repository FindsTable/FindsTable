import { getMe } from '@/server/directus/users'
import { getItemsByQuery } from './items'

export {
    countMyItems,
    itemCountIsValid,
    accessTokenIsValid,
    getUserId
}
interface MaxItemCount {
    [key : string ] : number
}

const maxItemCount : MaxItemCount = {
    "Finds": 6,
    "Thoughts": 10,
    "Thoughts_comments": 100,
    "Finds_comments": 100
}

async function itemCountIsValid(p : { 
    userId : string, 
    bearerToken: string,
    collection: string,
}) {
    const count = await countMyItems(p);
  
    // If we couldn't determine a proper count, it fails automatically
    if (count === undefined) {
      return false;
    }
  
    // If count has reached or exceeded the maximum, not valid
    if (count >= maxItemCount[p.collection]) {
      return false;
    }
  
    // Otherwise, it's valid (i.e., under the max count)
    return true;
  }
  
  /**
   * Used to count items in relational fields of the user object.
   * Returns:
   *  - a number if aggregator data is found (including 0 if no items exist)
   *  - undefined if something goes wrong or aggregator is missing
   */
async function countMyItems(p : { 
    userId : string, 
    bearerToken: string,
    collection : string 
}) {
    const res = await getItemsByQuery({
        collection: p.collection,
        auth: p.bearerToken,
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
    });
  
    // If no response or missing data, return undefined
    if (!res?.data) {
      return undefined;
    }
  
    // If the field isn't an array at all, return undefined
    if (
        !Array.isArray(res.data) || 
        res.data.length === 0
    ) {
      return undefined;
    }
  
    return res.data[0].count
  }


async function getUserId(bearerToken: string): Promise<string | undefined> {
    const { data } = await getMe({
        bearerToken: bearerToken,
        query: {
        fields: 'id'
        }
    })

    return data ? data.id : undefined
}

async function accessTokenIsValid(bearerToken: string): Promise<boolean> {
    const { data } = await getMe({
        bearerToken: bearerToken,
        query: {
            fields: 'id'
        }
    })

    return data?.id ? true : false
}