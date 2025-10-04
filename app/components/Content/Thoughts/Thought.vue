<script setup>
const me = useUserState()
const props = defineProps({
    item: Object,
    showUser: Boolean
})

const emit = defineEmits(['delete'])

const showComments = ref(false)

const newCommentsCount = ref(0)

function emit_updateNewCommentsCount(increment) {
    newCommentsCount.value += increment
}
</script>

<template>
    <ArchitectureAppStructureBoxesMainElement>
        <ArchitecturePanelMain>
            <div class="thoughtPanel ">
                <div class="flex justifyBetween">
                    <ContentUsersCardsMini
                        :userId="item.owner.id"
                        :avatarId="item.owner.avatar"
                        :username="item.owner.displayName || item.owner.username"
                        :date="useParseDate(item.date_created)"
                    />

                    <button 
                        v-if="item.owner.id === me.id"
                        @click="emit('delete', item.id)"
                        class="theme-textColor-main pointer"
                    >
                        <Icon name="delete" size="24px" />
                    </button>
                </div>

                <p class="content marTop20">
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
                    @newCommentPosted="emit_updateNewCommentsCount"
                    @closeComments="showComments = false"
                />
            </div>
        </ArchitecturePanelMain>
    </ArchitectureAppStructureBoxesMainElement>
    
</template>

<style>

.content {
  white-space: pre-wrap;
}

</style>