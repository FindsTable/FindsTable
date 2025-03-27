<script setup>
const cache = useCache()

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
        return res.data
    }

}

function newThoughtPosted(newThought) {

    newThoughts.value = [
        ...newThoughts.value,
        newThought
    ]

    useSetCacheData('thoughts', thoughts.value)
}

async function getNextPage() {
    requestOffset.value+= requestLimit.value
    const res = await getThoughts()
    thoughts.value = [
        ...thoughts.value,
        ...res
    ]
    useSetCacheData('thoughts', thoughts.value)
}

onMounted(async () => {
    const cacheData = useGetCachedData('thoughts', thoughts.value)

    if (cacheData) {
        thoughts.value = cacheData
        return
    }

    const res = await getThoughts()
    thoughts.value = [
        ...thoughts.value,
        ...res
    ]
    useSetCacheData('thoughts', thoughts.value)
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