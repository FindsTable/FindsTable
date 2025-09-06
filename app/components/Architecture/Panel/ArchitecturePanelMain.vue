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
            themeSurface2 ? 'theme-surface-2' : 'theme-surface-1'
        ]"
    >
        <slot>

        </slot>    
    </div>
</template>

<style scoped>
.panel {
    border-radius: 5px;
    padding: 16px;
}
</style>