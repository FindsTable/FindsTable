<script setup>
const { locale } = useI18n()

const $items = useNuxtApp().$items
const { data : badges } = useAsyncData(
    'badgeStore',
    async () => {
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

        return res.data
    }
)

const selectedBadge = ref('')

function handleEmit(badgeKey) {
    selectedBadge.value = badgeKey
}

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