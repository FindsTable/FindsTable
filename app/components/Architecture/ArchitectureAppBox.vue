<script setup>
const app = useAppConfig()
onMounted(() => {
    if(!useAppConfig().colorMode.active) {
        console.log('fallback color mode setiing')
        useAppConfig().colorMode.setting = 'dark'
        useAppConfig().colorMode.active = 'dark'
    }
})
</script>

<template>
    <div 
        id="app" 
        :class="[
            'full',
            'theme-backdropColor',
            'theme-textColor-main', 
            app.colorMode.active,
            app.colorMode.active ? 'ready' : 'notReady',
            app.fullScreen ? 'fullScreen' : ''
        ]">
        
        <!-- seperate slots so Overlaywon't be restricted by the App's padding for safe-area -->
        <slot name="content" />
        <slot name="overlay" />
    </div>
</template>

<style scoped>
#app {
    height: 100vh;
    overflow: hidden;
}
.theme-backdrop-color {
    background-color: var(--backdrop-color);
}
.notReady {
    opacity: 0;
}
.ready {
    opacity: 1;
}
</style>