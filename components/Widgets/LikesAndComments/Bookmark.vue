<script setup>

const props = defineProps({
    iconSize: String,
    fontSize: String,
    item: Object
})

const bookmarked = ref(false)
const thisBookmark = ref([])

onMounted(async() => {
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
                },
                onResponseError: () => {
                    bookmarked.value = true
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
                    item: props.item.id,
                    collection: props.item.collection
                },
                onRequest: () => {
                    bookmarked.value = true
                },
                onResponse: (res) => {
                    thisBookmark.value = res.response._data.data
                },
                onResponseError: (e) => {
                    bookmarked.value = false
                }
            }
        )
    }

    isPending.value = false
    
}

</script>

<template>

    <div 
        @click.stop.prevent="handleClick"
        class="touch pointer flex alignCenter justifyCenter pad5">
        <Icon 
            :name="bookmarked ? 'bookmarkFull' : 'bookmarkEmpty'" 
            :size="iconSize"
        />
    </div>
</template>