<script setup>
const props = defineProps({
    find: Object
})

const activeImageIndex = ref(0)


</script>

<template>
    <div
       v-if="find"
       class="find pointer"
    >
        <h1 v-if="find.title">
            {{ find.title }}
        </h1>

        <div class="centered w100">
            <img 
                :src="`https://admin.findstable.net/assets/${find.images[activeImageIndex].directus_files_id}`" alt=""
            
            >
        </div>
    </div>
</template>

<style scoped>
.find {
    flex-shrink: 0;
    width: 150px;
    height: 300px;
    background-color: green;
    padding: 7px;
    border-radius: 5px;
}
h1 {
    font-size: 20px;
}
img {
    width: 100%;
    aspect-ratio: 1;
    display: block;
}
</style>