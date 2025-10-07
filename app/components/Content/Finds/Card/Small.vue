<script setup>
const props = defineProps({
    find: Object,
    showUser: {
        type: Boolean,
        default: false
    }
})
</script>

<template>
    <article 
        v-if="find" 
        class="
            card
            w100 
            flex column gap10 justifyEnd
            theme-surface2
        "
    >
        <div
            class="flex justifyBetween"
        >
            <p class="title">
                {{ find.title }}
            </p>
        </div>

        <div
            v-if="find.image0 || find.image1"
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
                v-if="!find.image0 && find.image1"
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
        </div>
    </article>
</template>

<style scoped>
.card {
    overflow: hidden;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    padding: 10px 5px;
}
.title {
    font-size: 10px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.imageBox {
    width: 100%;
    display: flex;
    gap: 10px;
}

.frame {
    flex: 1;
    border-radius: 5px;
    aspect-ratio: 1 / 1;
    overflow: hidden;
}


</style>