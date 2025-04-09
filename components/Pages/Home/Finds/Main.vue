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
    'images.*',
    'likes.*',
    'comments.*'
]

async function getFinds() {
    const res = await useGetItems({
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
            // offset: requestOffset.value,
            // limit: requestLimit.value
        }
    })

    if (res) {
        return res
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

async function refreshThoughts() {
    console.log('refreshing')
    finds.value = await getFinds()
}

onMounted(async () => {
    await refreshThoughts()
})

</script>

<template>
    <ContentFindsMain
        :finds="finds"
        @getNextPage="getNextPage"
        @refresh="refreshThoughts"
    />
</template>