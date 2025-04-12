<script setup>
const {
    feed,
    getNextPage
} = await useFeed(
    useUserState().value.id,
    'Finds',
    [
        '*',
        'owner.avatars.*',
        'owner.id',
        'owner.displayName',
        'owner.username',
        'date_created',
        'date_lastEvent',
        'date_updated',
        'images.*',
        'likes.*',
        'comments.*'
    ]
)

onMounted(async () => {
    getNextPage()
})

definePageMeta({
    title: 'The table',
    description: 'Explore the finds made by the community.',
    middleware: 'private-route'
});

</script>

<template>
    <ContentFindsMain
        v-if="feed?.length"
        :finds="feed"
        @getNextPage="getNextPage"
        @refresh="refreshThoughts"
    />
</template>