<script setup>
const me  = useUserState()
const props = defineProps({
    itemId: String,
    collection: String
})
const emit = defineEmits(['closeComments', 'updateCommentCount'])

const fields = [
    'id',
    'content',
    'date_created',
    'owner.id',
    'owner.username',
    'owner.displayName',
    'owner.avatar'
]

const { data: comments, refresh, pending } = cacheDbGet(
    `comments:${props.collection}:${props.itemId}`,
    `/items/${props.collection}_comments`,
    {
        filter: {
            item: {
                _eq: props.itemId
            }
        },
        sort: 'date_created'
    }
)

</script>

<template>  
    <div>
        <ArchitecturePanelMain 
            @click.stop.prevent
            v-if="comments"
            class="commentsBox overflowScroll -scrollY"
            themeSurface2
        >

            <p class="font-title flex justifyBetween theme-textColor-main">
                <span>
                    Commentaires <span v-if="comments">({{ comments.length }})</span>
                </span>

                <Icon name="close" size="24px" class="pointer" @click="emit('closeComments')" />
            </p>

            <div 
                v-for="comment in comments" :key="comment.id"
                class="commentBox marTop20"    
            >
                <div class="flex justifyBetween">
                    <ContentItemsTopBarUser
                        :userId="comment.owner"
                        :date="useParseDate(comment.date_created)"
                        hideBorderBottom
                        hideBadgeRecord
                    />

                    <button 
                        v-if="comment.owner === me.id"
                        @click="deleteComment(comment.id)"
                        class="theme-textColor-main pointer"
                    >
                        <Icon name="delete" size="24px" />
                    </button>
                </div>

                <p class="content font-text marTop5">
                    {{ comment.content }}
                </p>
            </div>

            <ContentCommentsNew
                :itemId="itemId"
                :collection="collection"
                @newCommentSaved="newCommentSaved"
            />

        </ArchitecturePanelMain>
    </div>
</template>

<style scoped>
.commentBox {
    border-bottom: 1px solid var(--surface2-borderColor);
}
.commentsBox {
    max-height: 550px;
    overflow: scroll;
}
.content {
    padding: 10px 15px;
}
</style>