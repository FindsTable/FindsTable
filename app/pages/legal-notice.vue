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
        v-if="useUserState().value.isLoggedIn"
    >
        <template #title>

        </template>

        <template #header>

        </template>

        <template #noScrollMain>

        </template>

        <template #scrollMain>
            <ArchitectureAppStructureBoxesMainElement>
                <PagesLegalNotice />
            </ArchitectureAppStructureBoxesMainElement>
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