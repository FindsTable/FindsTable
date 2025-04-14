<script setup>
const { directFetch } = useDirectFetch()

const props = defineProps({
    iconSize: String,
    fontSize: String,
    clickable: {
        type: Boolean,
        default: false
    },
    likeCollection: String,
    itemId: String | Number,
    likes: Array,
    likes_count: Number
})

const localLikes = ref(props.likes)

const myLike = computed(() => {
    return localLikes.value.find((like) => {
        return like.user_created === useUserState().value.id
    })
})

const isPending = ref(false)

async function handleClick(itemId) {

    if (isPending.value) return
    isPending.value = true

    const params = {
        action: myLike.value ? 'unlike' : 'like',
        collection: props.likeCollection,
        itemId: itemId,
        likeId: myLike.value?.id
    };

    const res = await useLike(params);

    if (res.ok && res.status === 'liked') {
        localLikes.value.push(res.data);
    } else if (!res.ok && res.status === 'like_failed') {
        console.error('Failed to like:', res.error);
    } else if (res.ok && res.status === 'unliked') {
        localLikes.value = localLikes.value.filter(like => like.id !== myLike.value?.id);
    } else if (!res.ok && res.status === 'unlike_failed') {
        console.error('Failed to unlike:', res.error);
    }
    isPending.value = false
}

</script>

<template>
    <button
        v-if="likes"
        @click.stop.prevent="handleClick(itemId)" 
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
            v-if="localLikes.length" 
            class="count"
        >
            {{ localLikes.length ? localLikes.length : '' }}
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