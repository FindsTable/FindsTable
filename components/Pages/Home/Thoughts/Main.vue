<script setup>
const {
    feed,
    getNextPage
} = await useFeed(
    useUserState().value.id,
    'Thoughts',
    [
        '*',
        'owner.avatar',
        'owner.id',
        'owner.displayName',
        'owner.username',
        'date_created',
        'date_lastEvent',
        'date_updated',
        'likes.*'
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
    <ContentThoughtsMain
        v-if="feed?.length"
        :thoughts="feed"
        @getNextPage="getNextPage"
    />
</template>

<style scoped>


</style>