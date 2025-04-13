<script setup>
const props = defineProps({
    find: Object,
    format: String
})
const emit = defineEmits(['deleteFind'])

const me = useUserState()
const activeImageIndex = ref(0)

</script>

<template>
    <ContentFindsCardImageOnly
        v-if="format === 'image'"
        :find="find"
        :activeImageIndex="activeImageIndex"
    />

    <ContentFindsCardSmall
        v-if="format === 'small'"
        :find="find"
        :activeImageIndex="activeImageIndex"
        @deleteFind="emit('deleteFind', find.id)"
    />

    <ContentFindsCardMedium
        v-if="format === 'medium'"
        :find="find"
        :activeImageIndex="activeImageIndex"
        @deleteFind="emit('deleteFind', find.id)"
    />
</template>

<style scoped>

</style>