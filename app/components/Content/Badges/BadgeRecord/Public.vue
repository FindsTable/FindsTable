<script setup>
const props = defineProps({
    userId: String
})

const { data: badgeRecord } = cacheDbGet(
    `badgeRecord:${props.userId}`,
    `/items/Badge_records/${props.userId}`,
    {
        fields: [
            'id',
            'slot1.tier.image',
            'slot2.tier.image',
            'slot3.tier.image'
        ]
    }
)

setTimeout(() => {
    console.log(badgeRecord.value)
}, 5000)
</script>

<template v-if="badgeRecord">
    <div
        class="box flex gap5"
    >
        <div class="frame">
            <ContentBadgesBadgeRecordSlot
                :assetId="badgeRecord?.slot1?.tier?.image"
            />
        </div>

        <div class="frame">
            <ContentBadgesBadgeRecordSlot
                :assetId="badgeRecord?.slot2?.tier?.image"
            />
        </div>

        <div class="frame">
            <ContentBadgesBadgeRecordSlot
                :assetId="badgeRecord?.slot3?.tier?.image"
            />
        </div>
    </div>
</template>

<style scoped>
.box {
    height: 100%;
}
.frame {
    flex: 1 1 0;
    aspect-ratio: 1;
}
</style>