<script setup lang="ts">
import type { BadgeObject } from '#shared/types/dataObjects.ts'

const props = defineProps<{
    active: boolean
    badge: BadgeObject
}>()

const fileId = computed(() => {
    if(!props.badge.isMultilevel) {
        return props.badge.file
    } else if(props.badge.isMultilevel) {
        return props.badge.levels[0]?.file
    }
    return ''
})

</script>

<template>
    <div 
    v-if="fileId"
        class="centered relative" 
        :class="[
            active ? 'active' : 'inactive'
        ]"
    >
        <img :src="`${useAppConfig().directusUrl}/assets/${fileId}`" alt="">

        <ArchitectureFramesUserBadgeOverlay 
            v-if="badge.isDynamic"
            :badgeKey="badge.key"
            :userId="badge.userId as string"
        />
    </div>
</template>

<style scoped>

img {
    height: 150px;
}

.inactive {
    filter: grayscale(100%);
    opacity: 0.5;
}
</style>