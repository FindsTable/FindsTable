<script setup lang="ts">
const selectedBadge = ref('')

function handleEmit(badgeKey : string) {
    selectedBadge.value = badgeKey
}

const { data : badges } = useDirectGetOnMounted<SuccessBadge[]>(
    '/items/Success_badges',
    {
        fields: '*'
    }
)

</script>

<template>
    <div 
        v-if="badges"
        class="flex wrap justifyEvenly alignStretch gap30"
    >
        {{ badges }}
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