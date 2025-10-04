<script setup>
import { ContentFindsCardLarge } from '#components';
import { ContentFindsCardMedium } from '#components';

const theFields = [
    '*',
    'owner',
    'owner.id',
    'owner.displayName',
    'owner.username',
    'owner.avatar',
    'date_created',
    'date_lastEvent',
    'date_updated',
    'images.*',
    'likes.*',
    'comments.*'
]
const query = {
    fields: theFields
}
</script>

<template>
    <!-- <ContentMediaFeedCollection
        class="large"
        collection="Finds"
        :cardComponent="ContentFindsCardLarge"
        :query="query"
        :communityContent="true"
    /> -->

    <ContentMediaFeedCollection
        class="medium"
        collection="Finds"
        :cardComponent="ContentFindsCardMedium"
        :query="query"
        :communityContent="true"
    />
</template>

<style scoped>
/* @container (max-width: 550px) {
  .large {
    font-size: 2em;
  }
}
@container (min-width: 551px) {
  .medium {
    font-size: 2em;
  }
} */
</style>