<script setup>
const app = useAppConfig()

onMounted(() => {
    console.log("setting up theme on appBox")
    if(!useAppConfig().colorMode.active) {
        console.log('fallback color mode setiing')
        useAppConfig().colorMode.setting = 'dark'
        useAppConfig().colorMode.active = 'dark'
    }
})
</script>

<template>
    <div class="backdrop theme-backdropColor">
        <div 
            id="app" 
            :class="[
                'full',
                '',
                'theme-textColor-main', 
                app.colorMode.active,
                app.colorMode.active ? 'ready' : 'notReady',
                app.fullScreen ? 'fullScreen' : ''
            ]">
            
            <!-- seperate slots so Overlaywon't be restricted by the App's padding for safe-area -->
            <slot name="content" />
            <slot name="overlay" />
        </div>
    </div>
</template>

<style scoped>
#app {
    height: 100vh;
    width: min(100%, 850px);
    margin-inline: auto;
    overflow: hidden;
}
.notReady {
    opacity: 0;
}
.ready {
    opacity: 1;
}
</style>