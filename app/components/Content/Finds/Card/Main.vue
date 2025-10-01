<script setup>
const itemViewer = useItemViewerState()
const route = useRoute()

const cache = useCache()
const props = defineProps({
    find: Object,
    format: {
        type: String,
        default: 'medium'
    }
})
const emit = defineEmits(['deleteFind'])

const activeImageIndex = ref(0)

async function handleClick() {
    console.log(route.path)
    const curentPath = route.path
    // const itemViewer = {
    //     item = props.find,

    // }
    // console.log(`${route.fullPath}&itemViewer=true`)
    // await navigateTo(`${route.fullPath}&itemViewer=true`)

    // console.log(route.fullPath)
    // itemViewer.value.item = props.find
    // itemViewer.value.collection = 'Finds'
    // itemViewer.value.id = props.find.id
    // itemViewer.value.visible = true
}
</script>

<template>
    <ArchitecturePanelMain
         v-if="find" 
         class="w100 container pointer"
    >
        <ContentFindsCardLarge
            @click="handleClick"
            :find="find"
            :activeImageIndex="activeImageIndex"
            @deleteFind="emit('deleteFind', find.id)"
        />

        <!-- <ContentFindsCardMedium
            @click="handleClick"
            :find="find"
            :activeImageIndex="activeImageIndex"
            @deleteFind="emit('deleteFind', find.id)"
        /> -->
    </ArchitecturePanelMain>
</template>

<style scoped>

</style>
