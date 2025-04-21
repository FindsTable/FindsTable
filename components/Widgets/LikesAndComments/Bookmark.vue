<script setup>

const props = defineProps({
    iconSize: String,
    fontSize: String,
    item: Object
})

const bookmarked = ref(false)
const {
    response : thisBookmark,
    differedFetch,
    directFetch,
    isPending
} = useDirectAsyncFetch(
    'GET', '/items/Bookmarks',
    {
        singleItem: true,
        query: {
            filter: {
                _and: [
                    {
                        user_created: {
                            _eq: useUserState().value.id
                        }
                    },
                    {
                        [`${props.item.collection}_id`]: {
                            _eq: props.item.id
                        }
                    }
                ]
            }
        },
        onResponse: (res) => {
            if(res.value) {
                bookmarked.value = true
            }
        }
    }
)

async function handleClick() {

    if(isPending.value) return

    if(thisBookmark.value?.id) {
        await directFetch(
            'DELETE', `/items/Bookmarks/${thisBookmark.value.id}`,
            {
                onRequest: () => {
                    bookmarked.value = false
                },
                onResponse: async () => {
                    thisBookmark.value = null
                    useToaster(
                        'show',
                        {
                            id: `bookmark-${props.item.id}-deleted-success`,
                            message: "This bookmark was deleted ",
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
                }
            }
        )

    } else {
        await directFetch(
            'POST', `/items/Bookmarks`,
            {
                body: {
                    [`${props.item.collection}_id`]: props.item.id
                },
                onRequest: () => {
                    bookmarked.value = true
                },
                onResponse: (res) => {
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
                }
            }
        )
    }
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