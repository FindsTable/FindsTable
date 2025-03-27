<script setup>
const cache = useCache()
const $items = useNuxtApp().$items

const badges = ref(null)

async function getBadges() {
    const res = await $items.getByQuery({
        collection: 'Badges',
        query: {
            fields: '*,translations.*,translations.Languages_id.code',
            deep: {
                translations: {
                    _filter: {
                        Languages_id: {
                            code: {
                                _eq: 'en'
                            }
                        }
                    }
                }
            }
        }
    })

    if(res?.data) {
        return res.data
    }
}

const selectedBadge = ref('')

function handleEmit(badgeKey) {
    selectedBadge.value = badgeKey
}

onMounted(async () => {
    const cacheData = useGetCachedData('badges')
    if(cacheData) {
        badges.value = cacheData
    }
        
    badges.value = await getBadges()
    useSetCacheData('badges', badges.value)
})

</script>

<template>
    <div 
        v-if="badges"
        class="flex wrap justifyEvenly alignStretch gap30"
    >
        <ContentBadgesFrameMain 
            v-for="badge in badges" :key="badge.key"
            :badge="badge"
            :selected="selectedBadge === badge.key ? true : false"
            @selectBadge="handleEmit"
        />    

    </div>
</template>

<style scoped>

</style>