<script setup>
const { t } = useI18n()
const me = useUserState()
const props = defineProps({
    itemId: String,
    collection: String,
    commentCount: Number,
    likeCount: Number,
    myLikeId: String | undefined
})
const isPending = ref(false)
const emit = defineEmits(['toggleComments', 'deletedLike', 'createdLike'])

async function handleLikeClick() {
    if (isPending.value) return

    isPending.value = true
    if(props.myLikeId) {
        await deleteLike(props.myLikeId)
        emit('deletedLike', props.myLikeId)
    } else {
        const newLike = await createLike()
        emit('createdLike', newLike)
    }
    isPending.value = false
}

async function deleteLike(id) {
    const res = await useNuxtApp().$items.deleteById({
        collection: `${props.collection}_likes`,
        id: id
    })

    if (res?.ok) {
        return res.data
    }
}
async function createLike() {
    const res = await useNuxtApp().$items.create({
        collection: `${props.collection}_likes`,
        body: {
            item: props.itemId
        },
        query: {
            fields: '*'
        }
    })

    return res?.ok ? res.data : undefined
}

</script>

<template>
    <div class="box marTop20 flex alignCenter justifyBetween">
        <div>
            <button
                @click="handleLikeClick(itemId)"
                class="comp-button -text"
            >
                <Icon :name="myLikeId ? 'heartFull' : 'heartEmpty'" size="20px" />
            </button>

            <button
                @click="emit('toggleComments')"
                class="comp-button -text"
            >
                <Icon name="chat" size="20px" />
            </button>
        </div>

        <div class="flex gap20">
            <p v-if="likeCount">
                {{ likeCount }} {{ t(`activity.likes.like.${likeCount > 1 ? 'plural' : 'singular'}`) }}
            </p>

            <button 
                v-if="commentCount"
                @click="commentCount ? emit('toggleComments') : undefined"
                class="comp-button -text"
            >
                {{commentCount }} {{ t(`activity.comments.comment.${commentCount > 1 ? 'plural' : 'singular'}`) }}
            </button>
        </div>
    </div>
</template>

<style scoped>
.box {
    padding: 6px 10px;
    border-top: 1px solid var(--ui-color-dimmed);
    border-bottom: 1px solid var(--ui-color-dimmed);
}
</style>