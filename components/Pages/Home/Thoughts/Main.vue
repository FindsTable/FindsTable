<script setup>
const content = useContent()

const requestOffset = ref(0)
const requestLimit = ref(5)

const thoughts = ref([])
const newThoughts = ref([])

const fields = [
    '*',
    'user_created.avatar',
    'user_created.id',
    'user_created.displayName',
    'user_created.username',
    'date_created'
]

async function getThoughts() {

    console.log('getting thoughts')
    const res = await useNuxtApp().$items.getByQuery({
        collection: 'Thoughts',
        query: {
            fields: fields.join(','),
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

        content.value.thoughts = thoughts.value
    }

}
function newThoughtPosted(newThought) {

    newThoughts.value = [
        ...newThoughts.value,
        newThought
    ]

    content.value.toughts[0].unshift(newThought)
}

function getNextPage() {
    requestOffset.value+= requestLimit.value
    getThoughts()
}

onMounted(() => {
    if (content.value.thoughts.length ) {
        thoughts.value = content.value.thoughts
        return
    }
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

    <div v-if="thoughts" class="arch_scrollBottonPadding">
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