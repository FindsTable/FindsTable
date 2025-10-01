<script setup>
const me  = useUserState()
const props = defineProps({
    itemId: String,
    collection: String
})
const emit = defineEmits(['closeComments', 'updateNewCommentsCount'])

const fields = [
    'id',
    'content',
    'date_created',
    'owner.id',
    'owner.username',
    'owner.displayName',
    'owner.avatar'
]
const {
    response : comments,
    error,
    isPending,
    refresh
} = useDirectAsyncFetch(
    'GET', `/items/${props.collection}`,
    {
        query: {
            filter: {
                item: {
                    _eq: props.itemId
                }
            },
            fields: fields.join(','),
            deep: {
                owner: {
                    avatars: {
                        _sort: "-currentAt",
                        _limit: 1
                    }
                }
            },
            sort: 'date_created'
        }
    }
)

async function deleteComment(id) {
    const res = await $fetch(
        '/api/content/deleteItem',
        {
            method: 'DELETE',
            headers: {
                authorization: `Bearer ${me.value.accessToken.value}`
            },
            body: {
                collection: props.collection,
                id: id
            }
        }
    )

    console.log(res)

    if(res?.ok) {
        refresh()
        emit('updateNewCommentsCount', -1)
    }
}

function newCommentSaved(newComment) {
    refresh()
    emit('updateNewCommentsCount', 1)
}

</script>

<template>  
    <div class="marTop20" @click.stop>
        <ArchitecturePanelMain 
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
                class="commentBox flex alignStart marTop20"    
            >
                <div class="avatarBg">
                    <NuxtLink 
                        :to="`/users/${comment.owner.id}`"
                        class="pointer"    
                    >
                        <KeepAlive>
                            <ArchitectureFramesAvatar 
                                :fileId="comment.owner.avatar"
                                width="40px"
                                round
                            />
                        </KeepAlive>
                    </NuxtLink>
                </div>

                <div class="content grow">
                    <div class="flex justifyBetween">
                        <NuxtLink 
                            :to="`/users/${comment.owner.id}`"
                            class="pointer font-text -small -bold"
                        >
                            {{ comment.owner.displayName || comment.owner.username }}
                        </NuxtLink>

                        <button 
                            v-if="comment.owner.id === me.id"
                            @click="deleteComment(comment.id)"
                            class="theme-textColor-main pointer"
                        >
                            <Icon name="delete" size="24px" />
                        </button>
                    </div>
                    
                    <p class="font-text marTop5">
                        {{ comment.content }}
                    </p>
                </div>
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
.avatarBg {
    border-radius: 10px 0 0 10px;
    translate: 5px 5px;
}

.commentsBox {
    max-height: 550px;
    overflow: scroll;
}
.content {
    padding: 10px 15px;
}
</style>