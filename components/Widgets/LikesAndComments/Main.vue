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
    <div class="flex gap10">
        <WidgetsLikesAndCommentsLikeButton
            iconSize="24px" 
            :fontSize="fontSize"
            :likeCollection="`${collection}_likes`"
            :likes="item.likes"
            :itemId="item.id"
            :clickable="likeClick"
        />
        <WidgetsLikesAndCommentsCommentCount
            @click.stop.prevent="emit('commentClicked', item.id)"
            :count="item.comments?.length || 0"
            :iconSize="iconSize"
            :fontSize="fontSize"
            :clickable="commentClick"
        />
        <WidgetsLikesAndCommentsBookmark
            v-if="bookmark"
            @click.stop.prevent="emit('commentClicked', item.id)"
            :iconSize="iconSize"
            :fontSize="fontSize"
            :item="{
                id: item.id,
                collection: collection
            }"
        />
    </div>
</template>