<script setup>
const modal = useModalState()

</script>

<template>
    <div @click.stop class="comp-panel -surface1 panel flex column alignCenter justifyCenter">
        <component :is="modal.component" :data="modal.data" />
    </div>
</template>

<style scoped>
.backdrop {
    width: 100%;
    background-color: rgba(0, 0, 0, 0.85);
    isolation: isolate;
}

.comp-panel {
    width: min(500px, 70vw);
}
</style>