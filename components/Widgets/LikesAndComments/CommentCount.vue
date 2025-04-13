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
        class="touch flex alignCenter justifyCenter gap5"
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
.touch {
    background-color: transparent;
        color: var(--textButton-textColor);
    padding: 5px;
    border-radius: 5px;
}
.touch:hover {
    background-color: rgba(128, 128, 128, 0.468);
}
</style>