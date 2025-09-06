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
        <p class="font-title flex justifyBetween theme-textColor-main">
            <span>
                Commentaires <span v-if="comments">({{ comments.length }})</span>
            </span>

            <Icon name="close" size="24px" class="pointer" @click="emit('closeComments')" />
        </p>

        <div 
            v-if="comments"
            class="commentsBox overflowScroll -scrollY"
        >
            <div 
                v-for="comment in comments" :key="comment.id"
                class="flex alignStart marTop20"    
            >
                <!-- <div class="flex column alignEnd">
                    <div class="avatarBg theme-surface-2">
                        <NuxtLink 
                            :to="`/users/${comment.owner.id}`"
                            class="pointer"    
                        >
                            <KeepAlive>
                                <ArchitectureFramesAvatar 
                                    :fileId="comment.owner.avatar"
                                    width="24px"
                                    round
                                />
                            </KeepAlive>
                        </NuxtLink>
                    </div>

                    <div class="theme-surface-2 reversedBorderRadius">

                    </div>
                </div> -->
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

                <div class="content theme-surface-2 grow">
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

        </div>

        <div class="newCommentBox marTop20">
            <ContentCommentsNew
                :itemId="itemId"
                :collection="collection"
                @newCommentSaved="newCommentSaved"
            />
        </div>
    </div>
</template>

<style scoped>
.avatarBg {
    border-radius: 10px 0 0 10px;
    /* padding: 10px 5px 10px 10px; */
    translate: 5px 5px;
}
.reversedBorderRadius {
    width: 50%;
    aspect-ratio: 1;
    position: relative;
}
.reversedBorderRadius::after {
    content: "";
    width: 100%;
    aspect-ratio: 1;
    background-color: var(--surface1-bgColor);
    border-top-right-radius: 10px;
    position: absolute;
    top: 0;
    left: 0;
}
.commentsBox {
    max-height: 600px;
}
.content {
    padding: 10px 15px;
    border-radius: 8px;
}
</style>