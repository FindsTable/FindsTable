<script setup>
const props = defineProps({
    finds: {
        type: Array
    }
})

const emit = defineEmits(['getNextPage', 'refresh', 'findDeleted'])

async function deleteFind(findId) {
    const { openModal } = useConfirmationModal()

    const confirmDelete = await openModal({
        title: "Delete permanently ?",
        message: "your find will be deleted permanently, this action is not reversible."
    })

    if (!confirmDelete) {
        return
    }

    const res = await $fetch(
        `https://admin.findstable.net/items/Finds/${findId}`,
        {
            method: 'DELETE',
            headers: {
                authorization: `Bearer ${useUserState().value.accessToken.value}`
            }
            
        }
    )
    emit('findDeleted', findId)
}
</script>

<template>
    <div 
        v-if="finds"
        class="flex column"
    >
        <template class="flex column">
            <slot name="albumSelector">

            </slot>
        </template>
        
        <div class="box flex gap20 wrap marTop20">
            <ContentFindsCardMain
                v-for="find in finds" :key="find.id"
                :find="find"
                :format="useAppState().value.findViewer.cardSize"
                @click="navigateToItemPage(find)"
                @deleteFind="deleteFind"
            />
        </div>
    </div>

    <div class="centered">
        <button class="comp-button -filled marTop20 font-text -main" @click="emit('getNextPage')">
            next page
        </button>
    </div>
</template>

<style scoped>

</style>