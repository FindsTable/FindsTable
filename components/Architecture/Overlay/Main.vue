<!-- 
this component is used to display toasters, pop-ups and other elements that need to be
displayed on top of the screen.
-->

<script setup>
const appState = useAppState()
const modalState = useConfirmationModalState()
const newModalState = useModalState()
</script>

<template>
    <div class="overlay absoluteFull overflowHidden noEvents">
        <ArchitectureOverlayToastersMain />

        <div class="absoluteFull allEvents" v-if="modalState.isVisible">
            <ArchitectureOverlayConfirmation />
        </div>

        <div class="absoluteFull allEvents" v-if="newModalState.visible">
            <ArchitectureOverlayModalsMain />
        </div>
    </div>
</template>

<style scoped>
.overlay {
    padding: 
        var(--safe-inset-top) 
        var(--safe-inset-right) 
        var(--bottom-bar-height) 
        var(--safe-inset-left);
}
.overlay {
    isolation: isolate;
}

</style>