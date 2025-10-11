<script setup>
const props = defineProps({
    item: Object,
    singleFrame: {
        type: Boolean,
        default: false
    }
})
const emit = defineEmits(['delete'])

const me = useUserState()
const activeImageIndex = ref(0)
const showComments = ref(false)

// To update the count localy
const newCommentCount = ref(0)
function updateCommentCount(increment) {
    newCommentCount.value += increment
}

</script>

<template>
    <ArchitecturePanelMain 
        v-if="item" 
        class="
            card 
            flex column gap10 pointer justifyEnd
        "
    >
        <ContentItemsTopBarUser
            v-if="item?.owner?.id"
            :userId="item.owner.id"
            :date="useParseDate(item.date_created)"
        />

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
            <ContentItemsSocialToolBarMain
                :itemId="item.id"
                collection="Finds"
                @commentClick="showComments = !showComments"
            />
        </div>

        <KeepAlive>
            <ContentCommentsMain
                v-if="showComments"
                :itemId="item.id"
                collection="Finds"
                @closeComments="showComments = !showComments"
                @updateCommentCount="updateCommentCount"
            />
        </KeepAlive>

    </ArchitecturePanelMain>
</template>

<style scoped>
.card {
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
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