<script setup>
const { t } = useI18n()

definePageMeta({
    title: 'New Find',
    description: 'Add a new find to your collection',
    middleware: 'private-route',
});
</script>

<template>
    <NuxtLayout name="private-route">
        <template #title>
            {{ t('page.finds.newFind.title') }}
        </template>

        <template #header>
            {{ t('page.finds.newFind.pageLead') }}
        </template>

        <template #noScrollMain>

        </template>

        <template #scrollMain>
            <LazyPagesFindsNewFormMain />
        </template>
    </NuxtLayout>
    
</template>