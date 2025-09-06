<script setup>
const props = defineProps({
    fontSize: String,
    iconSize: String,
    collection: String,
    item: Object,
    likeClick: Boolean,
    commentClick: Boolean,
    bookmark: Boolean
})
const emit = defineEmits(['likeClick', 'commentClicked'])

function commentClicked() {
    if(props.commentClick) {
        console.log("comment click")
        emit('commentClick')
    }
}
</script>

<template>
    <div
        @click.stop
        class="box flex justifyEvenly w100"
    >
        <div class="centered grow">
            <WidgetsLikesAndCommentsLikeButton
                :iconSize="iconSize" 
                :fontSize="fontSize"
                :likeCollection="`${collection}_likes`"
                :likes="item.likes"
                :likes_count="item.likes_count"
                :itemId="item.id"
                :clickable="likeClick"
            />
        </div>

        <div class="centered grow">
            <WidgetsLikesAndCommentsCommentCount
                @click.stop.prevent="emit('commentClicked')"
                :count="item.comments?.length || 0"
                :iconSize="iconSize"
                :fontSize="fontSize"
                :clickable="commentClick"
            />
        </div>

        <div class="centered grow">
            <WidgetsLikesAndCommentsBookmark
                v-if="bookmark"
                :iconSize="iconSize"
                :fontSize="fontSize"
                :item="{
                    id: item.id,
                    collection: collection
                }"
            />
        </div>
    </div>
</template>

<style scoped>
.box {
    padding: 5px 0;
}
.grow {
    width: calc(100% / 3);
}
</style>