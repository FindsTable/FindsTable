<script setup>
const props = defineProps({
    find: Object,
    format: String
})
const emit = defineEmits(['deleteFind'])

const me = useUserState()
const activeImageIndex = ref(0)

function handleClick() {
    console.log(props.find.id)
    useSetCacheData(props.find.id, props.find)
    navigateTo(`/finds/${props.find.id}`)
}
</script>

<template>
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
</template>

<style scoped>

</style>