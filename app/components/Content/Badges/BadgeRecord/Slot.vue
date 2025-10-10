<script setup>
const props = defineProps({
    assetId: String
})
</script>

<template>
    <div
        class="frame full"
        :class="{
            empty: !assetId
        }"
    >
        <picture
            v-if="assetId"
        >
            <source 
                :srcset="`https://admin.findstable.net/assets/${assetId}?key=badge-350-webp`"
                type="image/webp"
            >

            <img
                :src="`https://admin.findstable.net/assets/${assetId}?key=badge-350-png`"
                class="block full"
            >
        </picture>
    </div>
</template>

<style scoped>
.frame {
    background-color: rgba(0, 0, 0, 0.096);
    border-radius: 5px;
    box-shadow: inset 0 0 25px rgba(201, 211, 143, 0.112);
}
.frame.empty {
    background-color: rgba(0, 0, 0, 0.096);
}
</style>

