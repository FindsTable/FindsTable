<script setup>
import { ContentThoughtsThought } from '#components';
const theFields = [
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
const query = {
    fields: theFields
}
</script>

<template>
    <ContentMediaFeedCollection
        collection="Thoughts"
        :query="query"
        :cardComponent="ContentThoughtsThought"
        :communityContent="true"
    />
</template>