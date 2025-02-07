<script setup>
const appState = useAppState()

function toggleFullScreen() {
    const app = document.getElementById('app');
    if (!document.fullscreenElement) {
        app.requestFullscreen().then(() => {
            appState.value.fullScreen = true;
        }).catch(err => {
            console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
    } else {
        document.exitFullscreen().then(() => {
            appState.value.fullScreen = false;
        }).catch(err => {
            console.error(`Error attempting to disable full-screen mode: ${err.message} (${err.name})`);
        });
    }
}
function handleFullScreenChange() {
    appState.value.fullScreen = !!document.fullscreenElement;
}

onMounted(() => {
    document.addEventListener('fullscreenchange', handleFullScreenChange);
});

onBeforeUnmount(() => {
    document.removeEventListener('fullscreenchange', handleFullScreenChange);
});
</script>
<template>
    <button 
        @click="toggleFullScreen"
        class="theme-textColor-main centered"
    >
        <Icon 
            v-if="!appState.fullScreen"
            name="fullScreen" 
            size="1.5rem"
        />
        <Icon
            v-else 
            name="fullScreenExit"
            size="1.5rem"
        />
    </button>
</template>

<style scoped>
</style>