<script setup>
const {
    response : badges,
    differedFetch : getBadges
} = useDirectAsyncFetch(
    'GET', '/items/Badges',
    {
        differed: true,
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
    }
)

const selectedBadge = ref('')

function handleEmit(badgeKey) {
    selectedBadge.value = badgeKey
}

onMounted(async () => {
    await getBadges()
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