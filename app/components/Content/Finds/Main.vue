<script setup lang="ts">
const props = defineProps<{
    finds: Find[],
    communityContent: {
        type: boolean,
        default: true
    }
}>();

const emit = defineEmits(['getNextPage', 'refresh', 'findDeleted'])

async function deleteFind(findId : FindId) {
    const { openModal } = useConfirmationModal()

    const confirmDelete = await openModal({
        title: "Delete permanently ?",
        message: "your find will be deleted permanently, this action is not reversible."
    })

    if (!confirmDelete) {
        return
    }

    const res = await $fetch(
        `/api/content/deleteItem`,
        {
            method: 'DELETE',
            headers: {
                authorization: `Bearer ${useUserState().value.accessToken.value}`
            },
            body: {
                collection: 'Finds',
                id: findId
            }
        }
    )

    if(res?.ok) {
        emit('findDeleted', findId)
    }
}
</script>

<template>
    <div 
        v-if="finds?.length"
    >
        <ArchitectureAppStructureBoxesMainElement
            v-for="find in finds" :key="find.id"
        >
            <ContentFindsCardMain
                :find="find"
                format="small"
                @deleteFind="deleteFind"
                :showUser="communityContent"
            />
        </ArchitectureAppStructureBoxesMainElement>
    </div>

    <div class="centered">
        <button class="comp-button -filled marTop20 font-text -main" @click="emit('getNextPage')">
            next page
        </button>
    </div>
</template>