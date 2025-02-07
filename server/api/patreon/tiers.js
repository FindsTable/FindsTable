const theTiers = defineCachedFunction(async () => {
    const runtimeConfig = useRuntimeConfig()

    const params = [
        '?include=tiers,tiers.benefits',
        '&fields%5Btier%5D=title',
        '&fields%5Bbenefit%5D=title,description'
    ]

    const { included: tiers } = await $fetch(
        `https://www.patreon.com/api/oauth2/v2/campaigns/${runtimeConfig.PATREON_CAMPAIGN_ID}${params.join('')}`,
        {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${runtimeConfig.PATREON_FINDSTABLENET_ACCESS_TOKEN}`
            }
        }
    )

    return tiers
},
{
    maxAge: 60 * 60 * 24,
    name: 'cached-tiers',
    getKey: () => 'cached-tiers'
})


export default defineEventHandler(async (event) => {
    const requestParams = getQuery(event)


    if (requestParams.id) {
        const tiers = await theTiers()
        return tiers.find(tier => tier.id === requestParams.id)
    }

    return await theTiers()
})