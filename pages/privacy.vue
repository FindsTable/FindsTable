<script setup>
const { t } = useI18n();

definePageMeta({
    title: 'Privacy',
    middleware: 'public-route',
})
const user = useUserState().value
const layout = computed(() => {
    if (user.isLoggedIn) {
        return 'private-route'
    }
    return 'public-route'
})
</script>

<template>
    <NuxtLayout :name="layout">
        <TH1>
            {{ t('page.privacy.title') }}
        </TH1>
    </NuxtLayout>
</template>