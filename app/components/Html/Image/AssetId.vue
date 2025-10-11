<script setup>
const props = defineProps({
    id: String
})
</script>

<template>
    <img 
        v-if="id"
        :src="`http://admin.findstable.net/assets/${id}`"
    >
</template>