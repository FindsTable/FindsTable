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

</script>

<template v-if="badgeRecord">
    <div
        class=" box flex gap5"
    >
        <ContentBadgesBadgeRecordSlot
            :assetId="badgeRecord?.slot1?.tier?.image"
        />

        <ContentBadgesBadgeRecordSlot
            :assetId="badgeRecord?.slot2?.tier?.image"
        />

        <ContentBadgesBadgeRecordSlot
            :assetId="badgeRecord?.slot3?.tier?.image"
        />
    </div>
</template>