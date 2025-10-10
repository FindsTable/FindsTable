<script setup lang="ts">
const me = useUserState()
const selectedBadge = ref('')

function handleEmit(badgeKey : string) {
    selectedBadge.value = badgeKey
}

const { data : badges } = cacheDbGet<SuccessBadge[]>(
    `storeBadges:${Date.now()}`,
    '/items/Badge_details',
    {
        fields: [
            'key',
            'defaultTier.image',
            'tiers.key',
            'tiers.badgeValues.badgeRecord',
            'tiers.badgeValues.tier.image',
            'description.*'
        ],
        deep: {
            tiers: {
                _filter: {
                    badgeValues: {
                        badgeRecord: {
                            _eq: me.value.id
                        }
                    }
                }
            }
        }
    }
)

function handleClick(key : string) {
    if(selectedBadge.value === key) {
        selectedBadge.value = ""
        return
    }
    selectedBadge.value = key
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
            :selected="selectedBadge === badge.key"
            :owned="badge.tiers.some(t => t.badgeValues?.length)"
            @click="handleClick(badge.key)"
        />
    </div>
</template>

<style scoped>

</style>