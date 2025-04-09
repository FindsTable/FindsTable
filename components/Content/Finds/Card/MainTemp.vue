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
    <article 
        v-if="find" 
        class="card"
    >
        <ContentFindsCardImageOnly
            v-if="format === 'image'"
            :find="find"
            :activeImageIndex="activeImageIndex"
        />

        <ContentFindsCardSmall
            v-if="format === 'small'"
            :find="find"
            :activeImageIndex="activeImageIndex"
        />

        <ContentFindsCardMedium
            v-if="format === 'medium'"
            :find="find"
            :activeImageIndex="activeImageIndex"
        />
    </article>
</template>

<style scoped>
.card {
    
}
</style>