<script setup>
const me = useUserState()
const props = defineProps({
    iconSize: String,
    fontSize: String,
    item: Object
})

const bookmarked = ref(!!(props.item.bookmarks && props.item.bookmarks.length))

async function handleClick() {

    if(bookmarked.value && props.item.bookmarks[0]) {
        bookmarked.value = false
        try {
            const res = await $fetch(
                `https://admin.findstable.net/items/Bookmarks/${props.item.bookmarks[0]}`,
                {
                    method: 'DELETE',
                    headers: {
                        authorization: 'Bearer ' + me.value.accessToken.value
                    }
                }
            )

        } catch(err) {
            bookmarked.value = true
            useHandleError(err)
        }
        return
    }
    
    bookmarked.value = true
    try {
        const res = await $fetch(
            'https://admin.findstable.net/items/Bookmarks',
            {
                method: 'POST',
                headers: {
                    authorization: 'Bearer ' + me.value.accessToken.value
                },
                body: {
                    Finds_id: props.item.id
                },
                query: {
                    fields: 'uniqueKey'
                }
            }
        )

    } catch(err) {
        bookmarked.value = false
        useHandleError(err)
    }
}
</script>

<template>
    <button 
        v-if="item"
        @click.stop.prevent="handleClick"
        class="touch pointer flex alignCenter justifyCenter pad5 pointer"
        :disabled="isPending"
    >
        <Icon 
            :name="bookmarked ? 'bookmarkFull' : 'bookmarkEmpty'" 
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