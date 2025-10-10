<script setup>
const props = defineProps({
    assetId: String,
    round: {
        type: Boolean,
        default: false
    }
})
</script>

<template>
    <div
        class="h100"
        :class="{
            round: round
        }"
    >
        <HtmlImageAssetId 
            :id="assetId"
            class="block h100"
        />
    </div>
</template>

<style scoped>

.round {
    border-radius: 1000px;
    overflow: hidden;
}

</style>

