<script setup>
const props = defineProps({
    userId: {
        type: String,
        required: true
    }
})

// const record = await useParsedBadgeRecord(props.userId)

</script>

<template>
    <div v-if="userId">
        {{ userId }}
    </div>
</template>