<script setup>
const props = defineProps({
    query: {
        type: Object
    }
})

const requestOffset = ref(0)
const requestLimit = ref(5)
const cache = useCache()
const finds = ref([])

const fields = [
    '*',
    'owner.avatars.*',
    'owner.id',
    'owner.displayName',
    'owner.username',
    'date_created',
    'images.*'
]

async function getFinds() {
    const res = await useNuxtApp().$items.directGetByQuery({
        collection: 'Finds',
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

    if(res?.toaster) {
        useToaster("show", res.toaster)
    }

    if (res?.data) {
        return res.data
    }
}

async function getNextPage() {
    requestOffset.value += requestLimit.value
    const res = await getFinds()

    finds.value = [
        ...finds.value,
        ...res.data
    ]
    useSetCacheData('finds', finds.value)
}

function navigateToItemPage(find) {
    cache.value.itemCache = find

    navigateTo(`/finds/${find.id}`)
    
}

onMounted(async () => {
    // const cacheData = useGetCachedData('finds')

    // if (cacheData) {
    //     finds.value = cacheData
    //     return
    // }

    const res = await getFinds()

    finds.value = [
        ...finds.value,
        ...res
    ]
    // useSetCacheData('finds', finds.value)
})

</script>

<template>
    <div 
        v-if="finds"
        class="flex gap20 wrap"
    >
        <PagesHomeFindsCard 
            v-for="find in finds" :key="find.id"
            :find="find"
            @click="navigateToItemPage(find)"
        />
    </div>

    <div class="centered">
        <button class="comp-button -filled marTop20 font-text -main" @click="getNextPage">
            next page
        </button>
    </div>
</template>