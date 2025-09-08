<script setup>
const appState = useAppState();

function toggleSideBar() {
    appState.value.showSideBar = !appState.value.showSideBar
}

</script>

<template>
    <div 
        class="
            bottomBar
            full flex justifyEvenly alignCenter gap20
        "
    >
        <Icon name="menu" class="pointer" @click="toggleSideBar" />

        <NuxtLink
            to="/notifications"
        >
            <ArchitectureToolBarsTextIconButton
                text="notifications"
                iconName="bellRing"
                class="pointer"
            />
        </NuxtLink>

        <ArchitectureToolBarsCreate />
    </div>
</template>