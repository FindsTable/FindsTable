<script setup>
const props = defineProps({
    active: Boolean,
    iconSize: String,
    fontSize: String,
    count: {
        type: Number,
        default: undefined
    },
    clickable: {
        type: Boolean,
        default: false
    },
    likeCollection: String,
    itemId: String
})
async function likeItem() {
    // const res = await useNuxtApp().$items.create({
    //     collection: 'Finds_likes'
    // })
}
</script>

<template>
    <Icon 
        :name="active ? 'heartFull' : 'heartEmpty'" 
        :size="iconSize"
        :class="[
            clickable ? 'pointer' : ''
        ]"
    />

    <span
        v-if="count !== undefined" 
        class="count"
    >
        {{ count }}
    </span>
</template>

<style scoped>
.count {
    font-size: v-bind('props.fontSize')
}
</style>