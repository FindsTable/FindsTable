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
</script>

<template>
    <div 
        v-if="item" 
        class="
            card 
            flex w100 gap10 justifyEnd
        "
    >
        <div class="imageBox overflowHidden">

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
                    v-else-if="item.image1"
                    :assetId="item.image1"
                    :sources="[
                        { presetKey: 'find-250-webp', mimeType: 'image/webp' }
                    ]"
                    fallbackUrl="/images/find-no-image.png"
                    class="shrink0 w100 image objectFitCover full"
                />
            </ArchitectureHorizontalScroller>

        </div>

        <div class="grow flex column">
            <div 
                class="
                    userBox
                    flex gap10 alignCenter
                "
            >
                <NuxtLink 
                    :to="`/users/${item.owner.id}`"  
                    @click.stop.prevent
                    class="flex gap10"
                
                >
                    <img v-if="item.owner.avatar"
                        :src="`https://admin.findstable.net/assets/${item.owner.avatar}?key=avatar-tiny-jpg&v=${Date.now()}`"
                        alt="metalhunter avatar" 
                        class="avatar" 
                    />
                </NuxtLink>

                <TH3>
                    {{ item.title }}
                </TH3>
            </div>

            <div class="flex column grow relative">
                <p class="description marTop10 absoluteFull">
                    {{ item.description }}
                </p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.imageBox {
    width: 90px;
    aspect-ratio: 1;
    border-radius: 12px;
    overflow: hidden;
}
.card {
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}
.userBox {
    border-bottom: 1px solid rgba(255, 255, 255, 0.29);
    padding-bottom: 4px;
}
.avatar {
    height: 1.2rem;
    aspect-ratio: 1;
    border-radius: 50%;
    object-fit: cover;
}
.username {
    font-size: 13px;
    font-weight: 600;
}

.description {
    font-size: 14px;
}

.likes {
    flex-shrink: 0;
}
</style>