<script setup>
const { t } = useI18n();

definePageMeta({
    title: 'Legal notice',
    middleware: 'public-route',
})

</script>

<template>
    <NuxtLayout 
        name="private-route"
        v-if="me.isLoggedIn"
    >
        <template #title>

        </template>

        <template #header>

        </template>

        <template #noScrollMain>

        </template>

        <template #scrollMain>
            <p v-if="collection">
                {{ collection }} }}
            </p>
            <PagesLegalNotice />
        </template>
    </NuxtLayout>

    <NuxtLayout 
        name="public-route"
        v-else
    >
        <main>
            <PagesLegalNotice />
        </main>
    </NuxtLayout>
</template>