export {
    useGetItems,
    // useParsedBadgeRecord
}

async function useGetItems(p : {
    collection: string,
    query: {
        [key : string] : any
    }
}) {
    const res : DirectusRes = await $fetch(
        `${useAppConfig().directusUrl}/items/${p.collection}`,
        {
            method: 'GET',
            headers: {
                authorization: `Bearer ${useUserState().value.accessToken.value}`
            },
            query: p.query
        }
    )

    return res.data
}

interface DirectusRes {
    data: any
}

type ParsedBadgeRecord = {
    slot1: string
    slot2: string
    slot3: string
}

// async function useParsedBadgeRecord(
//     userId : string
// ) : Promise<ParsedBadgeRecord> {

//     const result : ParsedBadgeRecord = {
//         slot1: "",
//         slot2: "",
//         slot3: ""
//     }

//     try {
//         const { data: record } = await $fetch<{data: any}>(
//             `https://admin.findstable.net/items/Badge_record/${userId}`,
//             {
//                 method: 'GET',
//                 headers: {
//                     authorization: `Bearer ${useUserState().value.accessToken.value}`
//                 },
//                 query: {
//                     fields: [
//                         'id',
//                         'slot1.level,slot2.level,slot3.level',
//                         'slot1.badge.variations.image',
//                         'slot1.badge.variations.image',
//                         'slot1.badge.variations.image',
//                     ]
//                 }
//             }
//         )
//         console.log(record)

//         if(!record) {
//             throw new Error()
//         }

//         result.slot1 = record.slot1.vadge.variation.find((
//             badgeLevel : string) => badgeLevel === record.slot1.level
//         ),
//         result.slot2 = record.slot2.vadge.variation.find((
//             badgeLevel : string) => badgeLevel === record.slot1.level),
//         result.slot3 = record.slot3.vadge.variation.find((
//                 badgeLevel : string) => badgeLevel === record.slot1.level)

//         return result

//     } catch(err) {
//           console.log(err)
//           return result
//     }
// }
