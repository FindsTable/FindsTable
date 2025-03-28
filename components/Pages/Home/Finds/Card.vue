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
                :src="`https://admin.findstable.net/assets/${find.images[activeImageIndex].directus_files_id}?key=find-small-jpg&v=${Date.now()}`" alt="">
        </div>

        <header class="header row justifyBetween alignStart">
            <h2 
                v-if="find.title" 
                class="title fS16 weight6 ellipsis"
            >
                {{ find.title }}
            </h2>

            <div class="username fS14 w100 ellipsis">
                {{ find.user_created.username }}
            </div>

            <time class="date fS12 weight3" datetime="2025-03-26">
                {{ useParseDate(find.date_created) }}
            </time>

            
        </header>

        <footer class="w100 flex alignCenter gap5">
            <img :src="`https://admin.findstable.net/assets/${find.user_created.avatars[0].image}?key=avatar-tiny-jpg&v=${Date.now()}`"
                alt="metalhunter avatar" class="avatar"
            />

            <div class="infoBox flex column">
                <div class="likes flex alignCenter gap5">
                    <WidgetsReactionBoxLikeButton 
                        :active="true" 
                        iconSize="14px" 
                        fontSize="12px"
                        :count="24"
                    />
                </div>

                <div class="comments">

                </div>
                <!-- <div class="likes flex alignCenter gap5">
                    <span class="heart fS12">❤️</span>
                    <span class="count fS12">24</span>
                </div>
                
                <div class="username fS14 w100 ellipsis">
                    {{ find.user_created.username }}
                </div> -->
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