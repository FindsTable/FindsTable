<script setup>
const props = defineProps({
    thoughts: Array,
    showUser: {
        type: Boolean,
        default: true
    }
})
const emit = defineEmits(['getNextPage', 'thoughtDeleted'])

/*
*   new thoughts are stored in newThoughts to prevent a 
*   full rendering 
*   of the already rendered thoughts
*/

const newThoughts = ref([])

function newThoughtPosted(newThought) {
    console.log(newThought)
    newThoughts.value = [
        newThought,
        ...newThoughts.value,
    ]
}

defineExpose({
    newThoughtPosted
})

const _thoughts = computed(() => {
    return [
        ...newThoughts.value,
        ...props.thoughts
    ]
})

async function deleteThought(thoughtId) {
    const { openModal } = useConfirmationModal()
    const confirmDelete = await openModal({
        title: "Delete permanently ?",
        message: "your thought will be deleted permanently, this action is not reversible."
    })

    if (!confirmDelete) {
        return
    }

    try {
        await $fetch(
            '/api/content/deleteItem',
            {
                method: 'DELETE',
                headers: {
                    authorization: `Bearer ${useUserState().value.accessToken.value}`
                },
                body: {
                    collection: 'Thoughts',
                    id: thoughtId
                }
            }
        )

        if(newThoughts.value.length) {
            newThoughts.value = newThoughts.value.filter(t => t.id !== thoughtId)
        }

        emit('thoughtDeleted', thoughtId)

        useToaster('show',{
            id: 'thought-deleted',
            message: 'Thought deleted !',
            type: 'success',
            autoClose: true,
            position: 'bottom'
        })
    } catch(err) {
        console.error(err)
    }
}
</script>

<template>
    <div v-if="_thoughts">
        <ContentThoughtsThought 
            v-for="thought in _thoughts" :key="thought.id" 
            :thought="thought" 
            @deleteThought="deleteThought" 
        />
    </div>
</template>