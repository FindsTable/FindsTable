<script setup>
const { t } = useI18n();

const user = useUserState().value

definePageMeta({
    title: 'Cookies',
    middleware: 'public-route',
})

</script>

<template>
    <NuxtLayout :name="layout">
        <TH1>
            Cookie policy
        </TH1>
    </NuxtLayout>
</template>