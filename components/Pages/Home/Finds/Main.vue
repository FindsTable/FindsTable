<script setup lang="ts">

type CollName = 'Finds'

type CollType = ItemType<
    Find3, 
    {
        owner: User;
        date_created: string;
        date_lastEvent: string;
        date_updated: string;
        images: FindImageId;
        likes: Like;
        likes_count: number;
        comments: ItemComment
    }
>

const theFields : ArrayOfValidFields<CollType, [
    '*',
    'owner',
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
]> = [
    '*',
    'owner',
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
]  as const

const { feed, getNextPage, removeItem } = await useFeed<
    CollName, CollType
>(
    'Finds',
    theFields
);

function removeFind(findId : FindId) {
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