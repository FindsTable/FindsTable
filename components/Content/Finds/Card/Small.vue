<script setup>
const props = defineProps({
    find: Object
})
const emit = defineEmits(['deleteFind'])
const me = useUserState()
const activeImageIndex = ref(0)
</script>

<template>
    <article v-if="find" class="card -surface1 flex column gap10 pointer justifyEnd">
        <ContentFindsCardMiniToolBar v-if="me.id === find.owner.id" @deleteFind="emit('deleteFind')" />

        <div class="imageBox w100 h100 overflowHidden">
            <img v-if="find.images.length"
                :src="`https://admin.findstable.net/assets/${find.images[activeImageIndex].directus_files_id}?key=find-250-jpg`"
                alt="" class="image w100 objectFitCover">
            <img v-else :src="`/images/find-no-image.png`" alt="" class="image w100 objectFitCover">

        </div>

        <header class="header row justifyBetween alignStart">
            <h2 v-if="find.title" class="title fS16 weight6 ellipsis">
                {{ find.title }}
            </h2>

            <time class="date fS12 weight3" datetime="2025-03-26">
                {{ useParseDate(find.date_created) }}
            </time>
        </header>


        <div class="userBox flex gap10 alignCenter">
            <img v-if="find.owner.avatars"
                :src="`https://admin.findstable.net/assets/${find.owner.avatars[0].image}?key=avatar-tiny-jpg&v=${Date.now()}`"
                alt="metalhunter avatar" class="avatar" />

            <div>
                {{ find.owner.displayName }}
            </div>
        </div>

        <div class="infoBox flex justifyEvenly alignCenter gap10">
            <WidgetsLikesAndCommentsMain
                fonSize="16px"
                iconSize="20px"
                collection="Finds"
                :item="find"
                :likeClick="true"
                :commentClick="false"
            />
        </div>

    </article>
</template>

<style scoped>
.card {
    align-self: last baseline;
    flex-shrink: 0;
    width: 250px;
    font-family: sans-serif;
    padding: 12px;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}
.card:hover {
    filter: brightness(0.9);
}
.imageBox {
    width: 100%;
    aspect-ratio: 1;
    border-radius: 12px;
    overflow: hidden;
}

.avatar {
    width: 30px;
    aspect-ratio: 1;
    border-radius: 50%;
    object-fit: cover;
}

.userBox {
    border-top: 1px solid rgba(255, 255, 255, 0.29);
    border-bottom: 1px solid rgba(255, 255, 255, 0.29);
    padding: 7px 0;
    /* margin-top: 8px;
    margin-bottom: 8px; */
}

.likes {
    flex-shrink: 0;
}
</style>