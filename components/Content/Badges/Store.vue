<script setup lang="ts">

const props = defineProps<{
  badges: FTBadge[];
}>();

const selectedBadge = ref('')

function handleEmit(badgeKey : string) {
    selectedBadge.value = badgeKey
}

onMounted(() => {
    setTimeout(() => {
        if(!useUserContent().value.badges.length) {
        console.log('No badges found')
        useGetUserContent()
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