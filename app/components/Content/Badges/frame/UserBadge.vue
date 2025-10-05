<script setup>
const props = defineProps({
    assetId: String
})
</script>

<template>
    <div class="frame aspectRatio1by1">
        <HtmlPictureMain
            v-if="props.assetId"
            :assetId="props.assetId"
            :sources="[
                {
                    mimeType: 'image/webp',
                    presetKey: 'badge-h150-q100-webp'
                },
                {
                    mimeType: 'image/png',
                    presetKey: 'badge-h150-q100-png'
                }
            ]"
        />
    </div>
</template>

<style scoped>
.frame {
    flex: 1 1 0;
    background-color: rgba(0, 0, 0, 0.096);
    padding: 10px;
    border: 1px solid var(--layout-line-color);
    border-radius: 5px;
    box-shadow: inset 0 0 25px rgba(201, 211, 143, 0.112);
}
</style>

