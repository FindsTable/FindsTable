<script setup>
const route = useRoute()
const cache = useCache()

const find = ref("null")

const fields = [
    '*',
    'user_created.avatar',
    'user_created.id',
    'user_created.displayName',
    'user_created.username',
    'date_created',
    'images.*'
]

async function fetchItem() {
    const res = await useNuxtApp().$items.getById({
        collection: 'Finds',
        id: `${route.params.id}`,
        query: {
            fields: fields.join(',')
        }
    })

    if(res?.ok && res.data) {
        find.value = res.data
    }
}

onMounted(() => {
    if(cache.value.itemCache?.id == route.params.id){
        find.value = cache.value.itemCache

        return
    }

    fetchItem()
})

definePageMeta({
    title: 'Find made by our users',
    description: 'Finds Table, a place to show your share of history.',
    middleware: 'private-route'
});
</script>

<template>
    <NuxtLayout name="private-route">
        <template #tabs>
        </template>

        <template #title>
            {{ find.title }}
        </template>

        <template #scrollMain>
            
        </template>
    </NuxtLayout>
</template>