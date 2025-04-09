<script setup>
const me = useUserState()
const props = defineProps({
    thought: Object
})
const localThought = ref({...props.thought})

const thoughtDeleted = ref(false)
const emit = defineEmits(['thoughtDeleted'])

const showComments = ref(false)


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

function emit_updateNewCommentsCount(increment) {
    newCommentsCount.value += increment
}
</script>

<template>
    <div v-if="!thoughtDeleted" class="thoughtPanel -surface1 marTop20">
        <div class="flex justifyBetween">
            <ArchitectureCardsUserMini 
                :userId="thought.owner.id"
                :avatarId="thought.owner.avatar"
                :username="thought.owner.displayName || thought.owner.username"
                :date="useParseDate(thought.date_created)"
            />

            <button 
                v-if="thought.owner.id === me.id"
                @click="deleteThought"
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
        />

        <KeepAlive>
            <ContentThoughtsComments 
                v-if="showComments"
                :thought="thought"
                @closeComments="showComments = false"
                @updateNewCommentsCount="emit_updateNewCommentsCount"
            />
        </KeepAlive>
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