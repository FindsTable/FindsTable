<script setup>
const me = useUserState()
const props = defineProps({
    thought: Object
})
const thoughtDeleted = ref(false)
const emit = defineEmits(['thoughtDeleted'])

const commentsComponent = useTemplateRef('comments')

const showComments = ref(false)
const showCommentInput = ref(false)

async function deleteThought() {
    const res = await useNuxtApp().$items.deleteById({
        collection: 'Thoughts',
        id: props.thought.id
    })

    if(res?.ok) {
        emit('thoughtDeleted', props.thought.id)
        thoughtDeleted.value = true
    }
}

const newCommentsCount = ref(0)

function updateNewCommentsCount(increment) {
    newCommentsCount.value += increment
}

</script>

<template>
    <div v-if="!thoughtDeleted" class="thoughtPanel -surface1 marTop20">
        <div class="flex justifyBetween">
            <ArchitectureCardsUserMini 
                :userId="thought.user_created.id"
                :avatarId="thought.user_created.avatars[0]?.image"
                :username="thought.user_created.displayName"
                :date="useParseDate(thought.date_created)"
            />

            <button 
                v-if="thought.user_created.id === me.id"
                @click="deleteThought"
                class="theme-textColor-main pointer"
            >
                <Icon name="delete" size="24px" />
            </button>
        </div>

        <p class="content marTop20">
            {{  thought.content }}
        </p>

        <WidgetsReactionBoxMain
            :itemId="thought.id"
            collection="Thoughts"
            :commentCount="thought.comments.length + newCommentsCount"
            @comment="showComments = true"
            @showComments="showComments = true"
        />        

        <PagesHomeThoughtsComments 
            v-if="showComments"
            :thought="thought"
            @closeComments="showComments = false"
            @updateNewCommentsCount="updateNewCommentsCount"
        />
    </div>
</template>

<style>
.thoughtPanel {
    padding: 16px;
    border-radius: 10px;
}
.content {
  white-space: pre-wrap;
}

</style>