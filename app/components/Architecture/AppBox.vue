<script setup>
const app = useAppConfig()

onMounted(() => {
    console.log("setting up theme on appBox")
    if(!useAppConfig().colorMode.active) {
        useAppConfig().colorMode.setting = 'dark'
        useAppConfig().colorMode.active = 'dark'
    }
})
</script>

<template>
    <div 
        id="viewportContainer"
        class="theme-backdropColor r"
        :class="[
            app.colorMode.active,
            'theme-textColor-main', 
                app.colorMode.active ? 'ready' : 'notReady',
                app.fullScreen ? 'fullScreen' : ''
        ]">

        <div 
            id="architecture-appBox" 
            class=""
        >
            <slot name="content" />
            <slot name="overlay" />
        </div>
    </div>
</template>

<style scoped>
.notReady {
    opacity: 0;
}
.ready {
    opacity: 1;
}
</style>