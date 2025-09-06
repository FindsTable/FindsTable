<script setup>
const cache = useCache()
const props = defineProps({
    find: Object,
    format: String
})
const emit = defineEmits(['deleteFind'])

const activeImageIndex = ref(0)

function handleClick() {
    cache.value.navigation = props.find
    navigateTo(`/finds/${props.find.id}`)
}
</script>

<template>
    <div v-if="find">
        <ContentFindsCardImageOnly
            v-if="format === 'image'"
            @click="handleClick"
            :find="find"
            :activeImageIndex="activeImageIndex"
        />

        <ContentFindsCardSmall
            v-if="format === 'small'"
            @click="handleClick"
            :find="find"
            :activeImageIndex="activeImageIndex"
            @deleteFind="emit('deleteFind', find.id)"
        />

        <ContentFindsCardMedium
            v-if="format === 'medium'"
            @click="handleClick"
            :find="find"
            :activeImageIndex="activeImageIndex"
            @deleteFind="emit('deleteFind', find.id)"
        />
    </div>
</template>

<style scoped>

</style>