<script setup>


definePageMeta({
    title: 'Unlink your patreon account',
    description: 'Finds Table, a place to show your share of history.',
    middleware: 'private-route',
});
</script>

<template>
    <NuxtLayout name="private-route">
        <template #title>
            Unlink your account
        </template>

        <template #noScrollMain> 
            If you unlink your account, you will loose all benefits.
        </template>

        <template #scrollMain> 
            <PatreonUnlinkAccountButton />
        </template>

        
    </NuxtLayout>
</template>