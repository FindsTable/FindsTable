<script setup>
import { ContentThoughtsThought } from '#components';
const props = defineProps({
    userId: String
})

const fields = [
    '*',
    'owner.avatar',
    'owner.id',
    'owner.displayName',
    'owner.username',
    'date_created',
    'likes.*'
]

const query = {
    fields: fields.join(','),
    filter: {
        owner: {
            _eq: props.userId
        }
    },
    deep: {
        owner: {
            avatars: {
                _sort: "-currentAt",
                _limit: 1
            }
        }
    },
    sort: "-date_created"
}

</script>

<template>
    <ContentMediaFeedCollection
        collection="Thoughts"
        :cardComponent="ContentThoughtsThought"
        :query="query"
        :communityContent="true"
    />
</template>