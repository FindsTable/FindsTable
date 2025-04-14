<script setup>
const appState = useAppState()
</script>

<template>
    <div class="">
        <!--    
            appState.findViewer.active is handled 
            by the route watcher in composable/appState
         -->
        <ArchitectureSideBarAppSettingsFindsViewer
            
            v-if="appState.findViewer.active" 
        />
    </div>
</template>