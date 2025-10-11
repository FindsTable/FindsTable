<script setup>
const me = useUserState()
const props = defineProps({
    item: Object,
    showUser: Boolean
})

const emit = defineEmits(['delete'])

const showComments = ref(false)

// To update the count localy
const newCommentsCount = ref(0)
function updateCommentCount(increment) {
    newCommentsCount.value += increment
}
</script>

<template>
    <ArchitecturePanelMain>
        <div>
            <ContentItemsTopBarUser
                v-if="item?.owner?.id"
                :userId="item.owner.id"
                :date="useParseDate(item.date_created)"
                @delete="emit('delete',item.id)"
            />

            <p class="content">
                {{  item.content }}
            </p>

            <WidgetsLikesAndCommentsMain
                fonSize="16px"
                iconSize="20px"
                collection="Thoughts"
                :item="item"
                :likeClick="true"
                :commentClick="true"
                @commentClicked="showComments = !showComments"
            />

            <ContentCommentsMain
                v-if="showComments"
                :itemId="item.id"
                collection="Thoughts_comments"
                @newCommentPosted="updateCommentCount"
                @closeComments="showComments = false"
            />
        </div>
    </ArchitecturePanelMain>
</template>

<style>

.content {
  white-space: pre-wrap;
  padding: 20px 0;
}

</style>