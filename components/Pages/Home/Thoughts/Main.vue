<script setup>
const cache = useCache()

const requestOffset = ref(0)
const requestLimit = ref(5)

const thoughts = ref([])


const fields = [
    '*',
    'owner.avatar',
    'owner.id',
    'owner.displayName',
    'owner.username',
    'date_created',
    'likes.*'
]

async function getThoughts() {
    const thoughts = await useGetItems({
        collection: 'Thoughts',
        query: {
            fields: fields.join(','),
            deep: {
                owner: {
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

    if (thoughts) {
        return thoughts
    }

}
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

    useSetCacheData('thoughts', thoughts.value)
}

async function getNextPage() {
    requestOffset.value+= requestLimit.value
    const res = await getThoughts()
    thoughts.value = [
        ...thoughts.value,
        ...res
    ]
    // useSetCacheData('thoughts', thoughts.value)
}

onMounted(async () => {
    // const cacheData = useGetCachedData('thoughts', thoughts.value)

    // if (cacheData) {
    //     thoughts.value = cacheData
    //     return
    // }

    const res = await getThoughts()
    thoughts.value = [
        ...thoughts.value,
        ...res
    ]
    // useSetCacheData('thoughts', thoughts.value)
})
function thoughtDeleted() {

}
</script>

<template>
    <ContentThoughtsMain
        v-if="thoughts.length"
        :thoughts="thoughts"
        @getNextPage="getNextPage"
    />
</template>

<style scoped>


</style>