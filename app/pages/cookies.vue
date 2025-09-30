<script setup>
const { t } = useI18n();
const me = useUserState()

definePageMeta({
    title: 'Cookies',
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
            <PagesLegalCookies />
        </template>
    </NuxtLayout>

    <NuxtLayout 
        name="public-route"
        v-else
    >
        <main>
            <PagesLegalCookies />
        </main>
    </NuxtLayout>
</template>