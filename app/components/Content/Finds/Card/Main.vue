<script setup>
const itemViewer = useItemViewerState()
const route = useRoute()

const cache = useCache()
const props = defineProps({
    find: Object,
    format: {
        type: String,
        default: 'medium'
    },
    showUser: {
        type: Boolean,
        default: true
    }
})
const emit = defineEmits(['deleteFind'])

const activeImageIndex = ref(0)

</script>

<template>
    <NuxtLink
        v-if="find"
        class="block allEvents"
        :to="`/finds/${find.id}`"
    >
        <ArchitecturePanelMain
            v-if="find" 
            class="w100 container pointer"
        >
            <div class="card large">
                <ContentFindsCardLarge
                    
                    :find="find"
                    :activeImageIndex="activeImageIndex"
                    @deleteFind="emit('deleteFind', find.id)"
                    :showUser="showUser"
                />
            </div>

            <div class="card medium">
                <ContentFindsCardMedium
                    @click="handleClick"
                    :find="find"
                    :activeImageIndex="activeImageIndex"
                    @deleteFind="emit('deleteFind', find.id)"
                />
            </div>
            
        </ArchitecturePanelMain>
    </NuxtLink>
</template>

<style scoped>
@container (max-width: 500px) {
    .large {
        display: none;
    }
}
@container (min-width: 500px) {
    .medium {
        display: none;
    }
}
</style>
