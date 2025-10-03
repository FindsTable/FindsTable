<script setup>
const props = defineProps({
    // surface1 and surface2 are used for theme colors
    themeSurface2: {
        type: Boolean,
        default: false
    }
})
</script>

<template>
    <div 
        class="panel"
        :class="[
            themeSurface2 ? 'theme-surface2' : 'theme-surface1'
        ]"
    >
        <slot />   
    </div>
</template>

<style scoped>
.panel {
    border-radius: 5px;
    padding: 16px;
    border-width: 1px;
    border-style: solid;
}
</style>