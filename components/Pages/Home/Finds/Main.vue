<script setup>
const requestOffset = ref(0)
const requestLimit = ref(5)
const cache = useCache()
const finds = ref([])

const fields = [
    '*',
    'user_created.avatars.*',
    'user_created.id',
    'user_created.displayName',
    'user_created.username',
    'date_created',
    'images.*'
]

async function getFinds() {
    console.log('getting finds')
    const res = await useNuxtApp().$items.getByQuery({
        collection: 'Finds',
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
    console.log(res.data)

    if (res?.data) {
        finds.value = [
            ...finds.value,
            ...res.data
        ]

        cache.value.finds = finds.value
    }
}

function getNextPage() {
    requestOffset.value += requestLimit.value
    getFinds()
}

function navigateToItemPage(find) {
    cache.value.itemCache = find

    console.log(cache.value)

    navigateTo(`/finds/${find.id}`)
    
}

onMounted(async () => {

    if(cache.value.finds) {
        finds.value = cache.value.finds
        return
    }
    console.log('getting all the finds')
    await getFinds()
})

</script>

<template>
    <div 
        v-if="finds"
        class="flex gap20"
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