<script setup>
const props = defineProps({
    _thoughts: Array
})
const emit = defineEmits(['getNextPage'])
const cache = useCache()

/*
*   new thoughts are stored in newThoughts to prevent a 
*   full rendering 
*   of the already rendered thoughts
*/
const newThoughts = ref([])
function newThoughtPosted(newThought) {
    newThoughts.value = [
        ...newThoughts.value,
        newThought
    ]

    // useSetCacheData('thoughts', thoughts.value)
}

const thoughts = computed(() => {
    return [
    ...newThoughts.value,
        ...props._thoughts
    ]
})

function getNextPage() {
    emit('getNextPage')
}
</script>

<template>
    <ContentThoughtsNew 
        @newThoughtPosted="newThoughtPosted"
    />

    <div v-if="newThoughts">
        <div
            v-for="thought in newThoughts" :key="thought.id" 
        >
            <ContentThoughtsThought :thought="thought" @thoughtDeleted="thoughtDeleted" />
        </div>
    </div>

    <div v-if="thoughts" class="arch_scrollBottonPadding">
        <div
            v-for="thought in thoughts" :key="thought.id" 
        >

            <ContentThoughtsThought :thought="thought" @thoughtDeleted="thoughtDeleted" />
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

<style scoped>


</style>