<script setup>
const props = defineProps({
    item: Object
})
const emit = defineEmits(['delete'])

const me = useUserState()
const activeImageIndex = ref(0)
const showComments = ref(false)

</script>

<template>
    <article 
        v-if="item" 
        class="
            card 
            flex column gap10 pointer justifyEnd
        "
    >
        <div 
            class="
                userBox
                flex gap10 alignCenter justifyBetween
                noEvents_kidsEvents
            "
        >
            <NuxtLink :to="`/users/${item.owner.id}`"  class="flex gap10">
                <img v-if="item.owner.avatar"
                    :src="`https://admin.findstable.net/assets/${item.owner.avatar}?key=avatar-tiny-jpg&v=${Date.now()}`"
                    alt="metalhunter avatar" 
                    class="avatar" 
                />

                <div>
                    <p
                        class="username"
                    >
                        {{ item.owner.displayName }}
                    </p>

                    <time class="date fS12 weight3" datetime="2025-03-26">
                        {{ useParseDate(item.date_created) }}
                    </time>
                </div>
            </NuxtLink>

            <ContentFindsCardMiniToolBar
                v-if="me.id === item.owner.id"
                @delete="emit('delete')"
            />
        </div>

        <TH3>
            {{ item.title }}
        </TH3>

        <div class="imageBox w100 overflowHidden">

            <ArchitectureHorizontalScroller 
                :gap="10"
            >
                <HtmlPictureMain
                    v-if="item.image0"
                    :assetId="item.image0"
                    :sources="[
                        { presetKey: 'find-250-webp', mimeType: 'image/webp' }
                    ]"
                    fallbackUrl="/images/find-no-image.png"
                    class="shrink0 w100 image"
                />

                <HtmlPictureMain
                    v-if="item.image1"
                    :assetId="item.image1"
                    :sources="[
                        { presetKey: 'find-250-webp', mimeType: 'image/webp' }
                    ]"
                    fallbackUrl="/images/find-no-image.png"
                    class="shrink0 w100 image objectFitCover full"
                />

                <div 
                    v-if="item.description"
                    class="descriptionSlide shrink0 full"
                >
                    <Tp>
                        {{ item.description }}
                    </Tp>
                </div>

                <HtmlPictureMain
                    v-if="!item.image0 && !item.image1"
                    :fallbackUrl="'/images/find-no-image.png'"
                    class="image w100 objectFitCover full"
                />
            </ArchitectureHorizontalScroller>

        </div>

        <div class="infoBox flex justifyEvenly alignCenter gap10">
            <WidgetsLikesAndCommentsMain
                fonSize="16px"
                iconSize="20px"
                collection="Finds"
                :item="item"
                :likeClick="true"
                :commentClick="true"
                @commentClicked="showComments = !showComments"
                :bookmark="true"
            />
        </div>

        <KeepAlive>
            <ContentCommentsMain
                v-if="showComments"
                :itemId="item.id"
                collection="Finds_comments"
                @closeComments="showComments = !showComments"
            />
        </KeepAlive>

    </article>
</template>

<style scoped>
.card {
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}
.userBox {
    border-bottom: 1px solid rgba(255, 255, 255, 0.29);
    padding-bottom: 8px;
}
.avatar {
    height: 100%;
    aspect-ratio: 1;
    border-radius: 50%;
    object-fit: cover;
}
.username {
    font-size: 13px;
    font-weight: 600;
}
.imageBox {
    width: 100%;
    aspect-ratio: 1;
    border-radius: 12px;
    overflow: hidden;
}
.descriptionSlide {
    font-size: 18px;
    font-weight: 500;
    padding: 50px;
    overflow: scroll;
    background-color: var(--tone-kaki-90);
}

.likes {
    flex-shrink: 0;
}
</style>