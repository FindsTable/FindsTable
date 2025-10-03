<script setup lang="ts">
type Find = {
    id: string,
    description: string,
    dating_period: {
        value: string,
        range_rom: number,
        range_to: number
    },
    dating_range_from: number,
    dating_range_to: number,
    dating_marked: number,
    user_created: {
        id: string,
        displayName: string,
        username: string,
        avatar: string
    },
    images: {
        directus_files_id: string
    }[]
}

const route = useRoute()
const cache = useCache()

const fields = [
    '*',
    'user_created.avatar',
    'user_created.id',
    'user_created.displayName',
    'user_created.username',
    'date_created',
    'images.directus_files_id'
]

const {
    response : find,
    isPending,
    error,
    refresh,
    differedFetch
} = useDirectAsyncFetch<Find>(
    'GET', `/items/Finds/${route.params.id}`,
    {
        differed: true,
        query: {
            fields: fields.join(',')
        }
    }
)

onMounted(() => {
    
    if(
        cache.value.navigation ||
        cache.value.navigation?.id === route.params.id
    ) {
        find.value = cache.value.navigation
    } else {
        console.log('hello')
        differedFetch()
    }
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
            <div v-if="find">
                {{ find.description }}
            </div>

            <div v-if="error">
                error: {{ error }}
            </div>

            <div v-if="isPending">
                LOADING ...
            </div>
        </template>

        <template #scrollMain>
            <ContentFindsCardMain
                :find="find"
                format="medium"
            />
        </template>
    </NuxtLayout>
</template>