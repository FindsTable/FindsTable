<script setup>
const props = defineProps({
    assetId: String
})
</script>

<template>
    <div class="frame">
        <picture
            v-if="assetId"
        >
            <source 
                :srcset="`https://admin.findstable.net/assets/${assetId}?key=badge-350-webp`"
                type="image/webp"
            >

            <img
                :src="`https://admin.findstable.net/assets/${assetId}?key=badge-350-png`"
                class="block full objectFitContain"
            >
        </picture>
    </div>
</template>

<style scoped>
.frame {
    height: 100%;
    aspect-ratio: 1;
    border-radius: 5px;
    background-color: rgba(0, 0, 0, 0.116);
}
</style>

