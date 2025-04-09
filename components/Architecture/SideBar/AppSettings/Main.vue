<script setup>
const appState = useAppState()
</script>

<template>
    <div class="">
        <ArchitectureSideBarAppSettingsFindsViewer
            v-if="appState.findViewer.active"
        />
    </div>
</template>