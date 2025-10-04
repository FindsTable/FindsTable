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

const {data : feed} = await $fetch(
    `https://admin.findstable.net/items/${props.collection}`,
    {
        method: 'GET',
        headers: {
            authorization: `Bearer ${useUserState().value.accessToken.value}`
        },
        query: props.query
    }
)

function removeDeletedHuntReport(id) {

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
        removeDeletedHuntReport(id)
    } catch(err) {
        useHandleError(err)
    }
}
</script>

<template>
    <div
        v-if="feed?.length"
    >
        <ArchitectureAppStructureBoxesMainElement
            v-for="item in feed" :key="item.id"
        >
            <component :is="cardComponent"
                :item="item"
                :showUser="true"
                @delete="deleteItem"
            />
        </ArchitectureAppStructureBoxesMainElement>
    </div>
</template>