<script setup lang="ts">

type Fields = [
    '*',
    `${keyof Thought}.${keyof User}`,
    `${keyof Thought}.${keyof User}`,
    `${keyof Thought}.${keyof User}`,
    `${keyof Thought}.${keyof User}`,
    keyof Thought,
    keyof Thought,
    keyof Thought,
    `${keyof Thought}.*`
]

const {
    feed,
    getNextPage,
    removeItem
} = await useFeed<"Thoughts", Fields>(
    'Thoughts',
    [
        '*',
        'owner.avatar',
        'owner.id' ,
        'owner.displayName',
        'owner.username',
        'date_created',
        'date_lastEvent',
        'date_updated',
        'likes.*'
    ]
)

function removeThought(thoughtId : ThoughtId) {
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