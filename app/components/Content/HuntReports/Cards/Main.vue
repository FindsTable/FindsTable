<script setup>
const props = defineProps({
    huntReport : Object,
    showUser: {
        type: Boolean,
        default: false
    },
    cardFormat: String
})
const emit = defineEmits(['deleteHuntReport'])
</script>

<template>
    <NuxtLink
        :to="`/hunt-reports/${huntReport.id}`"
        class=" theme-surface1"
    >
        <ArchitecturePanelMain>
            <ContentHuntReportsCardsLarge 
                v-if="cardFormat === 'large'"
                :huntReport="huntReport"
                :showUser="showUser"
                @delete="emit('deleteHuntReport', huntReport.id)"
            />
        </ArchitecturePanelMain>
    </NuxtLink>
    
</template>