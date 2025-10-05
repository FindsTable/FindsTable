<script setup>
import { ContentFindsCardLarge } from '#components';
import { ContentFindsCardMedium } from '#components';
const props = defineProps({
    userId: String
})
const query = {
    fields: '*,images.*,owner.*,owner.avatars.*',
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
    }
}
</script>

<template>
    <!-- <ContentMediaFeedCollection
        class="medium"
        collection="Finds"
        :cardComponent="ContentFindsCardMedium"
        :query="query"
        :communityContent="true"
    /> -->
    <ContentMediaFeedCollection
        collection="Finds"
        :cardComponent="ContentFindsCardLarge"
        :query="query"
        :communityContent="true"
    />
</template>