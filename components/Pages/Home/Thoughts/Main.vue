<script setup>
const requestOffset = ref(0)
const requestLimit = ref(5)

const thoughts = ref([])
const newThoughts = ref([])

async function getThoughts() {

    const res = await useNuxtApp().$items.getByQuery({
        collection: 'Thoughts',
        query: {
            fields: '*,user_created.avatars.*,user_created.id,user_created.displayName,user_created.username,date_created',
            deep: {
                user_created: {
                    avatars: {
                        _sort: "-currentAt",
                        _limit: 1
                    }
                }
            },
            sort: "-date_created",
            offset: requestOffset.value,
            limit: requestLimit.value
        }
    })

    if (res?.data) {
        thoughts.value = [
            ...thoughts.value,
            ...res.data
        ]
    }

}
function newThoughtPosted(newThought) {

    newThoughts.value = [
        ...newThoughts.value,
        newThought
    ]
}

function getNextPage() {
    requestOffset.value+= requestLimit.value
    getThoughts()
}

onMounted(() => {
    getThoughts()
})

</script>

<template>
    <PagesHomeThoughtsNew 
        @newThoughtPosted="newThoughtPosted"
    />

    <div v-if="newThoughts">
        <div
            v-for="thought in newThoughts" :key="thought.id" 
        >
            <PagesHomeThoughtsThought :thought="thought" @thoughtDeleted="thoughtDeleted" />
        </div>
    </div>

    <div v-if="thoughts">
        <div
            v-for="thought in thoughts" :key="thought.id" 
        >

            <PagesHomeThoughtsThought :thought="thought" @thoughtDeleted="thoughtDeleted" />
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