<script setup>

</script>

<template>
    <section>
        <h3 class="font-h3">
            <slot name="h3"></slot>
        </h3>

        <div class="colorModeBox">
            <slot name="content"></slot>
        </div>
    </section>
</template>

<style scoped>

</style>