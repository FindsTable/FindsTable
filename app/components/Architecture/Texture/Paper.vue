<script setup>
defineProps({
    file: {
        type: String,
        required: true
    }
})

</script>

<template>
    <!-- <img :src="file" alt="texture"  class="texture" /> -->

    <div class="content">
        <slot />
    </div>
</template>

<style scoped>
.texture {
    mix-blend-mode: multiply;
    opacity: 0;
    filter: contrast(1.2);
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    object-fit: cover;
    z-index: 1;
}
.content {
    z-index: 2;
}
</style>