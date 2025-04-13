<script setup>

const props = defineProps({
    iconSize: String,
    fontSize: String,
    item: Object
})

const bookmarked = ref(false)
const thisBookmark = ref([])

async function getBookmark() {
    const res = await useGetItems({
        collection: "Bookmarks",
        query: {
            filter: {
                _and: [
                    {
                        user_created: {
                            _eq: useUserState().value.id
                        }
                    },
                    {
                        item: props.item.id
                    }
                ]
            }
        }
    })

    if(res?.length) {
        thisBookmark.value = res[0]
        bookmarked.value = true
    }
}

onMounted(async() => {
    getBookmark()
})

const isPending = ref(false)

async function handleClick() {

    if(isPending.value) return
    isPending.value = true

    if(thisBookmark.value?.id) {
        await $fetch(
            `https://admin.findstable.net/items/Bookmarks/${thisBookmark.value.id}`,
            {
                method: 'DELETE',
                headers: {
                    authorization: `Bearer ${useUserState().value.accessToken.value}`
                },
                onRequest: () => {
                    bookmarked.value = false
                },
                onResponse: async () => {
                    thisBookmark.value = []
                    useToaster(
                        'show',
                        {
                            id: `bookmark-${props.item.id}-deleted-success`,
                            message: "This find was deleted ",
                            type: 'success',
                            autoClose: true,
                            position: 'bottom'
                        }
                    )
                },
                onResponseError: () => {
                    bookmarked.value = true
                    useToaster(
                        'show',
                        {
                            id: `bookmark-${props.item.id}-delete-error`,
                            message: "Aye ! bookmark not deleted !",
                            type: 'error',
                            autoClose: true,
                            position: 'bottom'
                        }
                    )
                    getBookmark()
                    isPending.value = false
                }
            }
        )

    } else {
        await $fetch(
            `https://admin.findstable.net/items/Bookmarks`,
            {
                method: 'POST',
                headers: {
                    authorization: `Bearer ${useUserState().value.accessToken.value}`
                },
                body: {
                    [`${props.item.collection}_id`]: props.item.id,
                    item: props.item.id,
                    collection: props.item.collection
                },
                onRequest: () => {
                    bookmarked.value = true
                },
                onResponse: (res) => {
                    thisBookmark.value = res.response._data.data
                    useToaster(
                        'show',
                        {
                            id: `bookmark-${props.item.id}-success`,
                            message: "This find was bookmarked !",
                            type: 'success',
                            autoClose: true,
                            position: 'bottom'
                        }
                    )
                },
                onResponseError: (e) => {
                    bookmarked.value = false
                    useToaster(
                        'show',
                        {
                            id: `bookmark-${props.item.id}-error`,
                            message: "Aye ! bookmarking failed !",
                            type: 'error',
                            autoClose: true,
                            position: 'bottom'
                        }
                    )
                    getBookmark()
                    isPending.value = false
                }
            }
        )
    }

    isPending.value = false
    
}

</script>

<template>
    <button 
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