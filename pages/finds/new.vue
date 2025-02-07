<script setup>

definePageMeta({
    title: 'New Find',
    description: 'Add a new find to your collection',
    middleware: 'private-route',
});
</script>

<template>
    <NuxtLayout name="private-route">
        <template #title>
            Add a new find
        </template>

        <template #header>

        </template>

        <template #noScrollMain>

        </template>

        <template #scrollMain>
            <LazyPagesFindsNewFormMain />
        </template>
    </NuxtLayout>
    
</template>