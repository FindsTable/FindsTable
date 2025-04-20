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
    refresh
} = useDirectAsyncFetch<Find>(
    'GET', `/items/Finds/${route.params.id}`,
    {
        query: {
            fields: fields.join(',')
        }
    }
)

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
            {{ find }}
        </template>
    </NuxtLayout>
</template>