<script setup>
const props = defineProps({
    find: Object,
    showUser: {
        type: Boolean,
        default: false
    }
})
const emit = defineEmits(['deleteFind'])

const me = useUserState()
const activeImageIndex = ref(0)
const showComments = ref(false)

onMounted(() => {
    console.log(props.find)
})
</script>

<template>
    <article 
        v-if="find" 
        class="
            card 
            w100
            flex column gap10 pointer justifyEnd
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
                :to="`/users/${find.owner.id}`"  
                class="flex gap10"
                
            >
                <img v-if="find.owner.avatar"
                    :src="`https://admin.findstable.net/assets/${find.owner.avatar}?key=avatar-tiny-jpg&v=${Date.now()}`"
                    alt="metalhunter avatar" 
                    class="avatar" 
                />

                <div

                >
                    <p
                        class="username"
                    >
                        {{ find.owner.displayName }}
                    </p>

                    <time class="date fS12 weight3" datetime="2025-03-26">
                        {{ useParseDate(find.date_created) }}
                    </time>

                </div>
            </NuxtLink>
        </div>

        <div
            class="flex justifyBetween"
        >
            <TH3>
                {{ find.title }}
            </TH3>

            <ContentFindsCardMiniToolBar
                v-if="me.id === find.owner.id"
                @deleteFind="emit('deleteFind')"
            />
        </div>

        <div
            v-if="find.image0 || find.image1 || find.description.length > 1"
            class="imageBox"
        >
            <div 
                v-if="find.image0"
                class="frame"
            >
                <HtmlPictureMain
                    :assetId="find.image0"
                    :sources="[
                        { presetKey: 'find-250-webp', mimeType: 'image/webp' }
                    ]"
                    fallbackUrl="/images/find-no-image.png"
                />
            </div>

            <div
                v-if="find.image1"
                class="frame"
            >
                <HtmlPictureMain
                    :assetId="find.image1"
                    :sources="[
                        { presetKey: 'find-250-webp', mimeType: 'image/webp' }
                    ]"
                    fallbackUrl="/images/find-no-image.png"
                />
            </div>

            <!-- 
                !!!!!!!!
                    v-if="find.description.length > 1"
                !!!!!!!!

                Empty description is equal to " ".  Se the dirty hack
                in /components/pages/finds/new/form that keeps directus happy
            -->
            <div class="frame">
                <p
                    v-if="find.description.length > 1"
                    class="frame description"
                >
                    {{ find.description }}
                </p>
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
    padding: 8px;
    font-size: 12px;
    font-weight: 500;
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