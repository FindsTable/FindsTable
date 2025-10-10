<script setup>
const route = useRoute()

const query = {
    Finds: {
        fields: [
            '*',
            'owner.id,owner.username,owner.displayName,owner.avatar',
            'metals.*.*'
        ]
    },
    Hunt_reports: {
        fields: [
            '*',
            'owner.id,owner.username,owner.displayName,owner.avatar',
            'finds.id,finds.image0,finds.image1',
            'finds.owner.id,finds.owner.avatar',
            'finds.title,finds.description',
            'bootyPhoto'
        ]
    }
}

const { data : item } = useDirectGetOnMounted(
    `/items/${route.params.collection}/${route.params.itemId}`,
    query[route.params.collection]
)

definePageMeta({
    middleware: 'private-route',
});
</script>

<template>
    <NuxtLayout name="private-route">
        <template #scrollMain>
            <ContentFindsCardFullPage
                v-if="route.params.collection === 'Finds' && item"
                :item="item"
                showUser
            />

            <ContentHuntReportsCardsFullPage
                v-if="route.params.collection === 'Hunt_reports' && item"
                :item="item"
                showUser
            />
        </template>
    </NuxtLayout>
</template>