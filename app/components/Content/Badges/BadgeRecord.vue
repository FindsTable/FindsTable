<script setup>
const props = defineProps({
    userId: {
        type: String,
        required: true
    }
})

const record = ref("null")

onMounted(async() => {
    record.value = await useParsedBadgeRecord(props.userId)
})
</script>

<template>
    <div
        class="box flex gap5"
    >
        <ContentBadgesFrameUserBadge
            :assetId="record.slot1"
        />

        <ContentBadgesFrameUserBadge
            :assetId="record.slot2"
        />

        <ContentBadgesFrameUserBadge
            :assetId="record.slot3"
        />

    </div>
</template>

<style scoped>


</style>