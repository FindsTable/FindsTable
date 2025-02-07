<script setup>
const appState = useAppState();

function toggleSideBar() {
    appState.value.showSideBar = !appState.value.showSideBar
}

</script>

<template>
    <div class="full flex justifyCenter alignCenter gap20">
        <NuxtLink 
            :to="useAppConfig().welcomeUrl" 
        >
            <Icon name="home" class="pointer" />
        </NuxtLink>

        <Icon name="menu" class="pointer" @click="toggleSideBar" />
    </div>
</template>