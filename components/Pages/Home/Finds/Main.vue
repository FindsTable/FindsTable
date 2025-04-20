<script setup>
const {
    feed,
    getNextPage,
    removeItem
} = await useFeed(
    'Finds',
    [
        '*',
        'owner.avatar',
        'owner.id',
        'owner.displayName',
        'owner.username',
        'date_created',
        'date_lastEvent',
        'date_updated',
        'images.*',
        'likes.*',
        'likes_count',
        'comments.*'
    ]
)


function removeFind(findId) {
    removeItem(findId)
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
    <ContentFindsMain
        v-if="feed?.length"
        :finds="feed"
        @getNextPage="getNextPage"
        @findDeleted="removeFind"
    />
</template>