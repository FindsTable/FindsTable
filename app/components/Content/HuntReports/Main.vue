<script setup>
const props = defineProps({
    huntReports: Array,
    communityContent: {
        type: Boolean,
        default: true
    }
})

const emit = defineEmits(['removeDeletedHuntReport'])

async function deleteHuntReport(id) {
    const { openModal } = useConfirmationModal()

    const confirmDelete = await openModal({
        title: "Delete permanently ?",
        message: "Your hunt report will be deleted permanently, this action is not reversible."
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
                    collection: 'Hunt_reports',
                    id: id
                }
            }
        )

        emit('removeDeletedHuntReport', id)

        useToaster('show', {
            id: crypto.randomUUID(),
            message: 'Your report was deleted',
            icon: 'error',
            type: 'success',
            autoClose: true,
            position: 'bottom'
        })
    } catch(error) {
        console.error("error", error.response)
    }
}

</script>

<template>
    <ArchitectureAppStructureBoxesMainElement
        v-for="huntReport in huntReports ?? []" :key="huntReport.id" 
    >
        <ContentHuntReportsCardsMain
            :huntReport="huntReport"
            :showUser="communityContent"
            cardFormat="large"
            @deleteHuntReport="deleteHuntReport"
        />
    </ArchitectureAppStructureBoxesMainElement>
</template>

<style scoped>

</style>