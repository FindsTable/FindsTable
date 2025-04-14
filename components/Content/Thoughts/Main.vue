<script setup>
const props = defineProps({
    thoughts: Array
})
const emit = defineEmits(['getNextPage', 'thoughtDeleted'])
const cache = useCache()

/*
*   new thoughts are stored in newThoughts to prevent a 
*   full rendering 
*   of the already rendered thoughts
*/
const newThoughts = ref([])

function newThoughtPosted(newThought) {
    newThoughts.value = [
        newThought,
        ...newThoughts.value,
        
    ]

    // useSetCacheData('thoughts', thoughts.value)
}

const _thoughts = computed(() => {
    return [
        ...newThoughts.value,
        ...props.thoughts
    ]
})

function getNextPage() {
    emit('getNextPage')
}
function thoughtDeleted() {

}

async function deleteThought(thoughtId) {
    const { openModal } = useConfirmationModal()
    const confirmDelete = await openModal({
        title: "Delete permanently ?",
        message: "your thought will be deleted permanently, this action is not reversible."
    })

    if (!confirmDelete) {
        return
    }
    const res = await useNuxtApp().$items.deleteById({
        collection: 'Thoughts',
        id: thoughtId
    })

    if(res?.ok) {
        if(newThoughts.value.length) {
            //filter new finds
            newThoughts.value = newThoughts.value.filter(t => t.id !== thoughtId)
        }
        //emit to filter older finds
        emit('thoughtDeleted', thoughtId)

        useToaster('show',{
            id: 'thought-deleted',
            message: 'Thought deleted !',
            type: 'success',
            autoClose: true,
            position: 'bottom'
        })
    }
}
</script>

<template>
    <ContentThoughtsNew 
        @newThoughtPosted="newThoughtPosted"
    />

    <div v-if="_thoughts" class="arch_scrollBottonPadding">
        <div
            v-for="thought in _thoughts" :key="thought.id" 
        >

            <ContentThoughtsThought 
                :thought="thought" 
                @deleteThought="deleteThought" />
        </div>

        <div class="centered">
            <button 
                class="comp-button -filled marTop20 font-text -main"
                @click="getNextPage"
            >
                next page
            </button>
        </div>
    </div>
</template>