<script setup lang="ts">

const props = defineProps<{
  badges: Badge[];
}>();

const selectedBadge = ref('')

function handleEmit(badgeKey : string) {
    selectedBadge.value = badgeKey
}

onMounted(async () => {
    setTimeout( async () => {
        if(!useUserContent().value.badges.length) {
            const {
                refreshCollection
            } = useHandleUserContent()

            await refreshCollection('badges')

        }
    }, 1000)
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