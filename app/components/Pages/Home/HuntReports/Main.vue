<script setup>
import { ContentHuntReportsCardsLarge } from '#components'

const theFields = [
    '*',
    'owner',
    'owner.id',
    'owner.displayName',
    'owner.username',
    'owner.avatar',
    'date_created',
    'date_updated',
    'title',
    'content',
    'likes.*',
    'comments.*'
]
const query = {
    fields: theFields
}
</script>

<template>
    <ContentMediaFeedCollection
        collection="Hunt_reports"
        :cardComponent="ContentHuntReportsCardsLarge"
        :query="query"
        :communityContent="true"
    />
</template>