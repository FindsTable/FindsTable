<script setup>
const props = defineProps({
    text: String,
  disabled: {
    type: Boolean,
    default: false,
  }
});
const emit = defineEmits(['click']);

async function handleClick() {
    emit('click');
};
</script>

<template>
    <button 
        @click.prevent.stop="handleClick"
        class="pointer"
    >
        {{ text }}
    </button>
</template>

<style scoped>
button {
    color: var(--main-light);
    background-color: var(--theme-color);
    padding: 6px 12px;
    border-radius: 5px;
    margin: auto;
    user-select: none;
}
button:hover {
    filter: brightness(1.1);
}
button:active {
    filter: brightness(0.9);
}
</style>