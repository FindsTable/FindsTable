export {
    useGetItems,
    useParsedBadgeRecord
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

async function useParsedBadgeRecord(
    userId : string
) : Promise<ParsedBadgeRecord> {

    const result : ParsedBadgeRecord = {
        slot1: "",
        slot2: "",
        slot3: ""
    }

    try {
        const { data: record } = await $fetch<{data: any}>(
            `https://admin.findstable.net/items/Badge_records/${userId}`,
            {
                method: 'GET',
                headers: {
                    authorization: `Bearer ${useUserState().value.accessToken.value}`
                },
                query: {
                    fields: [
                        'id',
                        'slot1.level',
                        'slot2.level',
                        'slot3.level',
                        'slot1.badge.variations.image',
                        'slot2.badge.variations.image',
                        'slot3.badge.variations.image',
                        'slot1.badge.variations.badgeLevel',
                        'slot2.badge.variations.badgeLevel',
                        'slot3.badge.variations.badgeLevel'
                    ]
                }
            }
        )

        if(!record) {
            throw new Error()
        }

        if(record.slot1) {
            const slot1Variation : any = record.slot1.badge.variations.find((v) => {
                return v.badgeLevel === record.slot1.level
            })
            result.slot1 = slot1Variation.image
        }
        if(record.slot2) {
            const slot2Variation : any = record.slot2.badge.variations.find((v) => {
                return v.badgeLevel === record.slot2.level
            })
            result.slot2 = slot2Variation.image
        }
        if(record.slot3) {
            const slot3Variation : any = record.slot3.badge.variations.find((v) => {
                return v.badgeLevel === record.slot3.level
            })
            result.slot3 = slot3Variation.image
        }
        return result

    } catch(err) {
          console.log(err)
          return result
    }
}
