<script setup>
const me = useUserState()
const props = defineProps({
    thought: Object
})

const emit = defineEmits(['deleteThought'])

const showComments = ref(false)

const newCommentsCount = ref(0)

function emit_updateNewCommentsCount(increment) {
    newCommentsCount.value += increment
}
</script>

<template>
    <div class="thoughtPanel -surface1 marTop20">
        <div class="flex justifyBetween">
            <ArchitectureCardsUserMini 
                :userId="thought.owner.id"
                :avatarId="thought.owner.avatar"
                :username="thought.owner.displayName || thought.owner.username"
                :date="useParseDate(thought.date_created)"
            />

            <button 
                v-if="thought.owner.id === me.id"
                @click="emit('deleteThought', thought.id)"
                class="theme-textColor-main pointer"
            >
                <Icon name="delete" size="24px" />
            </button>
        </div>

        <p class="content marTop20">
            {{  thought.content }}
        </p>

        <WidgetsLikesAndCommentsMain
            fonSize="16px"
            iconSize="20px"
            collection="Thoughts"
            :item="thought"
            :likeClick="true"
            :commentClick="true"
            @commentClicked="showComments = !showComments"
        />

        <ContentCommentsMain
            v-if="showComments"
            :itemId="thought.id"
            collection="Thoughts_comments"
            @newCommentPosted="emit_updateNewCommentsCount"
            @closeComments="showComments = false"
        />
    </div>
</template>

<style>
.thoughtPanel {
    padding: 10px;
    border-radius: 10px;
}
.content {
  white-space: pre-wrap;
}

</style>