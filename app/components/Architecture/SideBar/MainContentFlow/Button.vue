<script setup>
const props = defineProps({
    selected: Boolean,
    to: String
})
</script>
<template>
    <NuxtLink 
            :to="to"
            class="pointer comp-button -shaped flex gap5 alignCenter justifyEnd"
            :class="selected ? 'selected' : ''"
        >
        
        <slot name="text">

        </slot>

        <slot name="icon">

        </slot>
    </NuxtLink>
</template>

<style scoped>
.comp-button {
    height: 48px;
}

/* .comp-button {
    filter: grayscale(1);
}
.comp-button.selected {
    filter: grayscale(0);
} */
</style>