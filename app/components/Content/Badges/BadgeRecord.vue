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
        <div class="frame">
            <ContentBadgesFrameUserBadge
                :assetId="record.slot1"
            />
        </div>
        <div class="frame">
            <ContentBadgesFrameUserBadge
                :assetId="record.slot2"
            />
        </div>
        <div class="frame">
            <ContentBadgesFrameUserBadge
                :assetId="record.slot3"
            />
        </div>
    </div>
</template>

<style scoped>

.frame {
    flex: 1 1 0;
    aspect-ratio: 1;
}
</style>