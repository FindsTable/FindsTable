<!-- 
 
Creates a scollable container in a flex-growing element.

-->
<script setup>
const props = defineProps({
    childClass: String
})
</script>

<template>
    <div class="relative grow">
        <div class="absolute" :class="childClass">
            <slot />
        </div>
    </div>
</template>

<style scoped>
.absolute {
    inset: 0;
    overflow-y: scroll;
    overflow-x: hidden;
}

</style>