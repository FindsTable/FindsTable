<script setup>
const props = defineProps({
    item: Object,
    showUser: {
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

onMounted(() => {
    console.log(props.item)
})
</script>

<template>
    <ArchitecturePanelMain 
        v-if="item" 
        class="
            card 
            w100
            flex column gap10 justifyEnd
        "
    >
        <div 
            v-if="showUser"
            class="
                userBox
                flex gap10 alignCenter
                noEvents_kidsEvents
            "
        >
            <NuxtLink 
                :to="`/users/${item.owner.id}`"
                @click.stop
                class="flex gap10"
            >
                <img v-if="item.owner.avatar"
                    :src="`https://admin.findstable.net/assets/${item.owner.avatar}?key=avatar-tiny-jpg&v=${Date.now()}`"
                    alt="metalhunter avatar" 
                    class="avatar" 
                />

                <div

                >
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
        </div>

        <div
            class="flex justifyBetween"
        >
            <TH3>
                {{ item.title }}
            </TH3>

            <ContentFindsCardMiniToolBar
                v-if="me.id === item.owner.id"
                @deleteFind="emit('delete', item.id)"
            />
        </div>

        <div
            v-if="item.image0 || item.image1 || item.description.length > 1"
            class="imageBox"
        >
            <div 
                class="frame"
            >
                <ArchitectureHorizontalScroller>
                    <HtmlPictureMain
                        v-if="item.image0"
                        :assetId="item.image0"
                        :sources="[
                            { presetKey: 'find-250-webp', mimeType: 'image/webp' }
                        ]"
                        fallbackUrl="/images/find-no-image.png"
                        class="w100"
                    />

                    <HtmlPictureMain
                        v-if="item.image1"
                        :assetId="item.image1"
                        :sources="[
                            { presetKey: 'find-250-webp', mimeType: 'image/webp' }
                        ]"
                        fallbackUrl="/images/find-no-image.png"
                        class="w100"
                    />
                </ArchitectureHorizontalScroller>
            </div>
            <!-- 
                !!!!!
                    v-if="find.description.length > 1"
                !!!!!!!!

                Empty description is equal to " ".  Se the dirty hack
                in /components/pages/finds/new/form that keeps directus happy
            -->
            <div class="frame">
                <p
                    v-if="item.description.length > 1"
                    class="frame description"
                >
                    {{ item.description }}
                </p>
            </div>
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
                :commentCount="item.comments.length + newCommentCount"
            />
        </div>

        <ContentCommentsMain
            v-if="showComments"
            :itemId="item.id"
            collection="Finds_comments"
            @closeComments="showComments = !showComments"
            @updateCommentCount="updateCommentCount"
        />
    </ArchitecturePanelMain>
</template>

<style scoped>
.imageBox {
    width: 100%;
    display: flex;
    gap: 10px;
}
.frame {
    /* border: 1px solid red; */
    flex: 1;
    border-radius: 5px;
    aspect-ratio: 1 / 1;
    overflow: hidden;
}
.frame .description {
    padding: 10px;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.4-em;
    overflow: auto;
    background-color: var(--layout-line-color);
    white-space: pre-wrap;
    
}
.card {
    overflow: hidden;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.avatar {
    height: 100%;
    aspect-ratio: 1;
    border-radius: 50%;
    object-fit: cover;
}

.userBox {
    border-bottom: 1px solid rgba(255, 255, 255, 0.29);
    padding-bottom: 8px;
}
.username {
    font-size: 13px;
    font-weight: 600;
}

.likes {
    flex-shrink: 0;
}
</style>