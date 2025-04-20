<script setup>
const {
    feed,
    getNextPage,
    removeItem
} = await useFeed(
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
function removeThought(thoughtId) {
    removeItem(thoughtId)
}

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
        v-if="feed"
        :thoughts="feed"
        @getNextPage="getNextPage"
        @thoughtDeleted="removeThought"
    />
</template>

<style scoped>


</style>