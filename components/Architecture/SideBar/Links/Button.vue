<script setup>
const { t } = useI18n() 
const props = defineProps({
    textPath: String,
    icon: String,
    to: String,
});
</script>

<template>
    <NuxtLink :to="to" class="pointer comp-button -filled">
        {{ t(textPath) }}
    </NuxtLink>
</template>

<style scoped>
.comp-button {
    font-size: 1.3rem;
    font-weight: 700;
}
</style>