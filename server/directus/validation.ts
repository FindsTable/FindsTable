import { getMe } from '@/server/directus/users'

export {
    countMyItems,
    itemCountIsValid,
    accessTokenIsValid,
    getUserId
}
interface MaxItemCount {
    "finds" : number,
    "thoughts": number
}

const maxItemCount = {
    "finds": 6,
    "thoughts": 10
}

async function itemCountIsValid(p : { 
    bearerToken : string, 
    field : string 
}) {
    const count = await countMyItems(p);
  
    // If we couldn't determine a proper count, it fails automatically
    if (count === undefined) {
      return false;
    }
  
    // If count has reached or exceeded the maximum, not valid
    if (count >= maxItemCount[p.field]) {
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
    bearerToken : string, 
    field : string 
}) {
    const res = await getMe({
      bearerToken: p.bearerToken,
      query: {
        fields: p.field,
        deep: {
          [p.field]: {
            _aggregate: { count: '*' }
          }
        }
      }
    });
  
    // If no response or missing data, return undefined
    console.log(res.data)
    if (!res?.data) {
      return undefined;
    }
  
    // If the field isn't an array at all, return undefined
    const relatedItems = res.data[p.field];
    if (!Array.isArray(relatedItems)) {
      return undefined;
    }
  
    // If the array is empty, that means count is 0 (valid scenario)
    if (relatedItems.length === 0) {
      return 0;
    }
  
    // Grab the first item; if no numeric `count` property, return undefined
    const firstItem = relatedItems[0];
    if (typeof firstItem.count !== 'number') {
      return undefined;
    }
  
    return firstItem.count;
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