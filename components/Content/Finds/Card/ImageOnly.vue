<script setup>
const props = defineProps({
    find: Object,
    activeImageIndex: Number
})
</script>

<template>
    <div v-if="find" class="contentBox relative overflowHidden">
        <div class="imageBox w100 h100 overflowHidden">
            <img v-if="find.images.length"
                :src="`https://admin.findstable.net/assets/${find.images[activeImageIndex].directus_files_id}?key=find-250-jpg`"
                alt="" class="image w100 objectFitCover">
            <img v-else :src="`/images/find-no-image.png`" alt="" class="image w100 objectFitCover">
        </div>

        <div class="infoBox flex justifyEvenly alignCenter gap10">
            <div class="likes flex alignCenter gap5">
                <WidgetsLikesAndCommentsMain
                    fonSize="16px"
                    iconSize="20px"
                    collection="Finds"
                    :item="find"
                    :likeClick="true"
                    :commentClick="false"
                    :bookmark="true"
                />
            </div>
        </div>

    </div>
</template>

<style scoped>
.contentBox {
    border-radius: 12px;
    border: 1px solid rgba(128, 128, 128, 0.478);
}
.imageBox {
    width: 100%;
    aspect-ratio: 1;
}
.infoBox {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.551);
}
.likes {
    flex-shrink: 0;
}
</style>