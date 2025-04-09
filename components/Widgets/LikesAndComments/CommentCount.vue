<script setup>
const props = defineProps({
    count: Number,
    iconSize: String,
    fontSize: String,
    clickable: {
        type: Boolean,
        default: false
    },
})

</script>

<template>
    <button
        class="btn"
        :class="[
            clickable ? 'pointer' : 'defaultCursor'
        ]"
    >
        <Icon name="chat" :size="iconSize" />

        <span 
            :style="{
                fontSize: props.fontSize
            }"
            class="count"
        >
            {{ count ? count : '' }}
        </span>
    </button>
</template>

<style scoped>
.btn {
    background-color: transparent;
    color: var(--textButton-textColor);
}
</style>