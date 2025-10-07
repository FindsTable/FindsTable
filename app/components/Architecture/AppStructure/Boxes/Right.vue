<script setup>
const appState = useAppState();
</script>

<template>
    <nav 
        id="architecture-rightBox"
        class=""
    >

        <ArchitecturePanelMain
            v-for="(log, index) in appState.logs" :key="index"
        >    
            {{ log }}   
        </ArchitecturePanelMain>
        <slot />
    </nav>
</template>