<script setup>
const me = useUserState()
const props = defineProps({
    itemId: String,
    collection: String,
    commentCount: Number
})

const emit = defineEmits(['showComments', 'like', 'comment'])

const { data : likes, refresh } = useAsyncData(
    `${props.itemId}-likes`,
    async () => {
        const res = await useNuxtApp().$items.getById({
            collection: props.collection,
            id: props.itemId,
            query: {
                fields: 'id,likes.id,likes.user_created'
            }
        })

        if (res?.data) {
            return res.data.likes
        }
    }
)

async function handleLikeClick() {
    myLike.value ? deleteLike() : createLike()
}

async function deleteLike() {
    const res = await useNuxtApp().$items.deleteById({
        collection: `${props.collection}_likes`,
        id: myLike.value
    })
    console.log(res)
    if (res?.ok) {
        refresh()
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

    if (res?.ok) {
        refresh()
    }
}

const myLike = computed(() => {
    if (!likes.value || !me?.value.id) return false

    const like = likes.value.find(like => like.user_created === me.value.id)
    return like ? like.id : null
})

</script>

<template>
    <div class="box marTop20 flex alignCenter justifyBetween">
        <div>
            <button
                @click="handleLikeClick"
                class="comp-button -text"
            >
                <Icon :name="myLike ? 'heartFull' : 'heartEmpty'" size="20px" />
            </button>

            <button
                @click="emit('comment')"
                class="comp-button -text"
            >
                <Icon name="chat" size="20px" />
            </button>
        </div>

        <div class="flex gap20">
            <p v-if="likes">
                {{ likes.length }} likes
            </p>

            <button 
                @click="commentCount ? emit('showComments') : undefined"
                class="comp-button -text"
            >
                {{ `${commentCount} comment${commentCount > 1 ? 's' : ''}` }}
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