//this could be turned into a cachedEventHandler

const cachedCampaign = defineCachedFunction(async () => {
    const runtimeConfig = useRuntimeConfig()
    const params = [
        '?include=tiers&fields%5Btier%5D=title,description'
    ]

    const campaign = await $fetch(
        `https://www.patreon.com/api/oauth2/v2/campaigns/${runtimeConfig.PATREON_CAMPAIGN_ID}${params.join('')}`,
        {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${runtimeConfig.PATREON_FINDSTABLENET_ACCESS_TOKEN}`
            }
        }
    )
    return campaign
}, {
    maxAge: 60 * 60 * 24,
    name: 'cached-campaign',
    getKey: () => 'cached-campaign',
})

export default defineEventHandler(async (event) => {

    const requestParams = getQuery(event)

    if (requestParams.tiers) {
        return await cachedCampaign().included
    }
    return await cachedCampaign()
})


