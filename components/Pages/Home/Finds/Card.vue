<script setup>
const props = defineProps({
    find: Object
})

const activeImageIndex = ref(0)


</script>

<template>
    <article v-if="find" class="card flex column gap10 pointer">
        <div class="imageBox w100 h100 overflowHidden">
            <img class="image w100 objectFitCover"
                :src="`https://admin.findstable.net/assets/${find.images[activeImageIndex].directus_files_id}`" alt="">
        </div>

        <header class="header row justifyBetween alignStart">
            <h2 
                v-if="find.title" 
                class="title fS16 weight6 ellipsis"
            >
                {{ find.title }}
            </h2>

            <time class="date fS12 weight3" datetime="2025-03-26">Mar 26, 2025</time>
        </header>

        <footer class="w100 flex alignCenter gap5">
            <img :src="`https://admin.findstable.net/assets/${find.user_created.avatars[0].image}`"
                alt="metalhunter avatar" class="avatar"
            />

            <div class="infoBox">
                <div class="likes alignCenter gap5">
                    <span class="heart fS12">❤️</span>
                    <span class="count fS12">24</span>
                </div>
                
                <div class="username fS14 w100 ellipsis">
                    {{ find.user_created.username }}dsqdsqdsqsds
                </div>
            </div>
        </footer>
    </article>
</template>

<style scoped>

.card {
    width: 250px;
    font-family: sans-serif;
    background-color: #3f3f3f;
    padding: 12px;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    
    
}

.imageBox {
    height: 160px;
    border-radius: 12px;
    overflow: hidden;
}

.avatar {
    width: 30px;
    aspect-ratio: 1;
    border-radius: 50%;
    object-fit: cover;
}

.infoBox {
    width: calc(100% - 34px);
}

.likes {
    flex-shrink: 0;
}
</style>