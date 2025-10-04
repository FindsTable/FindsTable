<script setup>
const props = defineProps({
    badgeRecord: Object
})

const slots = computed(() => {
    return [
        props.badgeRecord.slot1,
        props.badgeRecord.slot2,
        props.badgeRecord.slot3,
    ]
})

</script>

<template>
    <div class="box flex gap20" v-if="badgeRecord && slots.length">
        <div class="frame r" v-for="badge in slots">
            <img 
                v-if="badge" 
                class="badge"
                :src="`https://admin.findstable.net/assets/${badge[badgeRecord[badge.key]]}`" alt=""
            >
        </div>
    </div>
</template>

<style scoped>
.box {
    padding: 10px;
    border-radius: 10px;
}
.frame {
    height: 75px;
    aspect-ratio: 1;
}
.badge {
    height: 100%;
}
</style>