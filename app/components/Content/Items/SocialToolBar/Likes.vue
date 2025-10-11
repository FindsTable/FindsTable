<script setup>
const me = useUserState()
const props = defineProps({
    collection: String,
    itemId: String
})

const { data: likes, refresh, pending: likesPending } = cacheDbGet(
    `likes:${props.collection}:${props.itemId}`,
    `/items/${props.collection}_likes`,
    {
        fields: '*',
        filter: {
            item: {
                _eq: props.itemId
            }
        }
    }
)

const isPending = ref(false)

const myLike = computed(() => {
    if(!likes.value?.length) return

    return likes.value.find((i => i.user_created === me.value.id))
})

async function handleClick() {
    if(likesPending.value || isPending.value ) {
        return
    }

    isPending.value = true

    try {
        if(myLike.value) {
            await dbDelete(
                `/items/${props.collection}_likes/${myLike.value.id}`
            )
        } else {
            await dbPost({
                endpoint: `/items/${props.collection}_likes`,
                body: {
                    item: props.itemId
                }
            })
        }

        refresh()

    } catch(err) {
        useHandleError(err)
    }

    isPending.value = false
}

</script>

<template>
    <button
        v-if="likes"
        @click.stop.prevent="handleClick()"
        class="touch flex alignCenter gap5 pointer"
    >
        <Icon 
            :name="myLike ? 'heartFull' : 'heartEmpty'" 
            :size="iconSize"
            :class="[
                clickable ? 'pointer' : ''
            ]"
        />

        <span
            v-if="likes.length" 
            class="count"
        >
            {{ likes.length || '' }}
        </span>
    </button>
</template>

<style scoped>
.touch {
    background-color: transparent;
        color: var(--textButton-textColor);
    padding: 5px;
    border-radius: 5px;
}
.touch:hover {
    background-color: rgba(128, 128, 128, 0.468);
}
.count {
    font-size: v-bind('props.fontSize')
}
</style>