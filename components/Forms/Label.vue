<script setup>
const props = defineProps({
    labelClick: {
        type: Boolean,
        default: false
    }
})
</script>

<template>
    <label 
        class="flex column"
        :class="{
            noEventLabel: labelClick === false
        }"
    >
        <span class="standardLabel theme-textColor-main">
            <slot name="label" />
        </span>

        <div>
            <slot name="input" />
        </div>
    </label>
</template>

<style>
.noEventLabel {
    pointer-events: none;
}

.noEventLabel input {
    pointer-events: all;
}
</style>