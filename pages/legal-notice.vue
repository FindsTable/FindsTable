<script setup>
const { t } = useI18n();

const user = useUserState().value

definePageMeta({
    title: 'Legal notice',
    middleware: 'public-route',
})

</script>

<template>
    <NuxtLayout :name="layout">
        <TH1>
            {{ t('page.legalNotice.title') }}
        </TH1>
    </NuxtLayout>
</template>