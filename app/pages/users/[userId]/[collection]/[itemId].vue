<script setup>
const route = useRoute()

const query = {
    Finds: {
        fields: [
            '*',
            'owner.username,owner.displayName,owner.avatar',
            'metals.*.*'
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
        </template>
    </NuxtLayout>
</template>