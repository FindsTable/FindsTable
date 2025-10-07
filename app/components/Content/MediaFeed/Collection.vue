<script setup>

const props = defineProps({
    collection: String,
    cardComponent: Object,
    query: Object,
    communityContent: {
        type: Boolean,
        default: true
    }
})

const { data : feed } = useDirectGetOnMounted(
    `/items/${props.collection}`,
    props.query
)

function removeItemFromFeed(id) {
    console.log(feed.value)
    feed.value = feed.value.filter(item => item.id !== id)
}

async function deleteItem(id) {
    const { openModal } = useConfirmationModal()

    const confirmDelete = await openModal({
        title: "Delete permanently ?",
        message: "your find will be deleted permanently, this action is not reversible."
    })

    if (!confirmDelete) {
        return
    }

    try {
        await $fetch(
            `/api/content/deleteItem`,
            {
                method: 'DELETE',
                headers: {
                    authorization: `Bearer ${useUserState().value.accessToken.value}`
                },
                body: {
                    collection: props.collection,
                    id: id
                }
            }
        )
        removeItemFromFeed(id)
    } catch(err) {
        useHandleError(err)
    }
}
</script>

<template>
    
    <div
        v-if="feed?.length"
    >
        
        <NuxtLink
            v-for="item in feed" :key="item.id"
            :to="`/users/${item.owner.id}/${props.collection}/${item.id}`"
            class="pointer"
        >
            <ArchitectureAppStructureBoxesMainElement
                
            >
                <component :is="cardComponent"
                    :item="item"
                    :showUser="true"
                    @delete="deleteItem"
                />
            </ArchitectureAppStructureBoxesMainElement>
        </NuxtLink>
    </div>
</template>