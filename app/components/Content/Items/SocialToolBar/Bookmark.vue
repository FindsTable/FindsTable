<script setup>
const me = useUserState()
const props = defineProps({
    itemId: String,
    collection: String
})

const { data: { value : [ myBookmark ]}, pending, refresh } = cacheDbGet(
    `bookmark:${props.collection}:${props.item}`,
    `/items/Bookmarks`,
    {
        fields: '*',
        filter: {
            _and: [
                {
                    user_created: {
                        _eq: me.value.id
                    }
                },
                {
                    Finds_id: {
                        _eq: props.itemId
                    }
                }
            ]
        }
    }
)



async function handleClick() {

    if(pending.value) return
    pending.value = true

    try {
        if(myBookmark) {
            await dbDelete({
                endpoint: `/items/Bookmarks/${myBookmark.id}`
            })
        } else {
            await dbPost({
                endpoint: '/items/Bookmarks',
                body: {
                    Finds_id: props.itemId
                }
            })
        }
    }catch(err) {
        useHandleError(err)
    }

    refresh()

    pending.value = false
}
</script>

<template>
    <button 
        @click.stop.prevent="handleClick"
        class="touch pointer flex alignCenter justifyCenter pad5 pointer"
        :disabled="pending"
    >
        <Icon 
            :name="myBookmark ? 'bookmarkFull' : 'bookmarkEmpty'" 
            :size="iconSize"
        />
    </button>
</template>

<style scoped>
.touch {
    background-color: transparent;
    color: var(--textButton-textColor);
    padding: 5px;
    border-radius: 5px;
    pointer-events: all;
}
.touch:hover {
    background-color: rgba(128, 128, 128, 0.468);
}
.touch:disabled {
    pointer-events: none;
    cursor: default;
}
</style>