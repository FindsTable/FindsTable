<script setup>
const props = defineProps({
    find: Object
})
const emit = defineEmits(['deleteFind'])

const me = useUserState()
const activeImageIndex = ref(0)
const showComments = ref(false)

</script>

<template>
    <article 
        v-if="find" 
        class="
            card -surface1 
            flex column gap10 pointer justifyEnd
        "
    >
        <ContentFindsCardMiniToolBar
            v-if="me.id === find.owner.id"
            @deleteFind="emit('deleteFind')"
        />

        <div class="imageBox w100 overflowHidden">

            <ArchitectureHorizontalScroller 
                :gap="10"
            >
                <HtmlPictureMain
                    v-if="find.image0"
                    :assetId="find.image0"
                    :sources="[
                        { presetKey: 'find-250-webp', mimeType: 'image/webp' }
                    ]"
                    fallbackUrl="/images/find-no-image.png"
                    class="shrink0 w100 image"
                />

                <HtmlPictureMain
                    v-if="find.image1"
                    :assetId="find.image1"
                    :sources="[
                        { presetKey: 'find-250-webp', mimeType: 'image/webp' }
                    ]"
                    fallbackUrl="/images/find-no-image.png"
                    class="shrink0 w100 image objectFitCover full"
                />

                <div 
                    v-if="find.description"
                    class="descriptionSlide shrink0 full"
                >
                    <Tp>
                        {{ find.description }}
                    </Tp>
                </div>

                <HtmlPictureMain
                    v-if="!find.image0 && !find.image1"
                    :fallbackUrl="'/images/find-no-image.png'"
                    class="image w100 objectFitCover full"
                />
            </ArchitectureHorizontalScroller>

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
                :src="`https://admin.findstable.net/assets/${find.owner.avatar}?key=avatar-tiny-jpg&v=${Date.now()}`"
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
                :commentClick="true"
                @commentClicked="showComments = !showComments"
                :bookmark="true"
            />
        </div>

        <ContentCommentsMain
            v-if="showComments"
            :itemId="find.id"
            collection="Finds_comments"
            @closeComments="showComments = !showComments"
        />

    </article>
</template>

<style scoped>
.descriptionSlide {
    font-size: 18px;
    font-weight: 500;
    padding: 50px;
    overflow: scroll;
    background-color: var(--tone-kaki-90);
}
.card {
    align-self: last baseline;
    flex-shrink: 0;
    width: min(450px, 100%);
    font-family: sans-serif;
    padding: 12px;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
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