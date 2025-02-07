<script setup>
const { t } = useI18n()
definePageMeta({
    title: 'Success badges',
    description: 'Earn badges by sharing finds.',
    middleware: 'private-route',
});
</script>

<template>
    <NuxtLayout name="private-route">
        <template #title>
            {{ t('page.badges.title') }}
        </template>
        
        <template #header>
            <TH2 class="marTop20">
                {{ t('page.badges.pageLead') }}
            </TH2>
        </template>

        <template #scrollMain>
            <ContentBadgesStore />
        </template>
    </NuxtLayout>
</template>