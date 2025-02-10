<script setup>
const me  = useUserState()
const props = defineProps({
    thought: Object
})
const emit = defineEmits(['closeComments', 'updateNewCommentsCount'])

const { data: comments, refresh } = useAsyncData(
    `${props.thought.id}-comments`,
    async () => {
        const res = await useNuxtApp().$items.getByQuery({
            collection: 'Thoughts_comments',
            query: {
                filter: {
                    thought: {
                        _eq: props.thought.id
                    }
                },
                fields: '*,user_created.id,user_created.username,user_created.displayName,user_created.avatars.image',
                deep: {
                    user_created: {
                        avatars: {
                            _sort: "-currentAt",
                            _limit: 1
                        }
                    }
                },
                sort: 'date_created'
            }
        })

        if(res?.data) {
            return res.data
        }
    }
)

async function deleteComment(id) {
    const res = await useNuxtApp().$items.deleteById({
        collection: 'Thoughts_comments',
        id: id
    })

    if(res?.ok) {
        refresh()
        emit('updateNewCommentsCount', -1)
    }
}

function newContentSaveed(newComment) {
    refresh()
    emit('updateNewCommentsCount', 1)
}

</script>

<template>  
    <div class="marTop20" v-if="comments">
        <p class="font-title flex justifyBetween theme-textColor-main">
            <span>
                Commentaires
            </span>

            <Icon name="close" size="24px" class="pointer" @click="emit('closeComments')" />
        </p>

        <div class="commentsBox overflowScroll -scrollY">
            <div 
                v-for="comment in comments" :key="comment.id"
                class="flex alignStart marTop20"    
            >
                <div class="flex column alignEnd">
                    <div class="avatarBg theme-surface-2">
                        <NuxtLink 
                            :to="`/users/${comment.user_created.id}`"
                            class="pointer"    
                        >
                            <ArchitectureFramesAvatar 
                                :fileId="comment.user_created.avatars[0].image"
                                width="24px"
                                round
                            />
                        </NuxtLink>
                    </div>

                    <div class="theme-surface-2 reversedBorderRadius">

                    </div>
                </div>

                <div class="content theme-surface-2 grow">
                    <div class="flex justifyBetween">
                        <NuxtLink 
                            :to="`/users/${comment.user_created.id}`"
                            class="pointer font-text -small -bold"
                        >
                            {{ comment.user_created.displayName || comment.user_created.username }}
                        </NuxtLink>

                        <button 
                            v-if="comment.user_created.id === me.id"
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
            <ContentCommentsTextarea 
                placeholder="Add a comment ..." 
                :itemsCreateParams="(textContent) => {
                        return {
                            collection: 'Thoughts_comments',
                            body: {
                                content: textContent,
                                thought: thought.id
                            },
                            query: {
                                fields: '*'
                            },
                            sort: 'date_created'
                        }
                    }"
                @newContentSaved="newContentSaveed"
            />
        </div>
    </div>
</template>
<style scoped>
.avatarBg {
    border-radius: 10px 0 0 10px;
    padding: 10px 5px 10px 10px;
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
    max-height: 30vh;
}
.content {
    padding: 10px 15px;
    border-radius: 0 10px 10px 10px;
}
</style>