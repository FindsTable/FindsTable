<script setup>
const props = defineProps({
    find: Object
})
const me = useUserState()
const activeImageIndex = ref(0)

</script>

<template>
    <article v-if="find" class="card flex column gap10 pointer justifyEnd">
        <ContentFindsCardMiniToolBar
            v-if="me.id === find.owner.id"
        />

        <div class="imageBox w100 h100 overflowHidden">
            <img
                v-if="find.images.length" 
                :src="`https://admin.findstable.net/assets/${find.images[activeImageIndex].directus_files_id}?key=find-small-jpg&v=${Date.now()}`" alt=""
                class="image w100 objectFitCover"
            >
            <img
                v-else
                :src="`/images/find-no-image.png`" alt=""
                class="image w100 objectFitCover"
            >
                
        </div>

        <header class="header row justifyBetween alignStart">
            <h2 
                v-if="find.title" 
                class="title fS16 weight6 ellipsis"
            >
                {{ find.title }}
            </h2>

            <div class="username fS14 w100 ellipsis">
                {{ find.owner.displayName }}
            </div>

            <time class="date fS12 weight3" datetime="2025-03-26">
                {{ useParseDate(find.date_created) }}
            </time>

            
        </header>

        <footer class="w100 flex alignCenter gap5">
            <img
                v-if="find.owner.avatars"
                :src="`https://admin.findstable.net/assets/${find.owner.avatars[0].image}?key=avatar-tiny-jpg&v=${Date.now()}`"
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
            </div>
        </footer>
    </article>
</template>

<style scoped>

.card {
    align-self: last baseline;
    flex-shrink: 0;
    width: 200px;
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