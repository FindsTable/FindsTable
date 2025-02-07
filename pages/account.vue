<script setup>
const user = useUserState()
const { t } = useI18n();



definePageMeta({
    title: 'Account',
    description: 'Finds Table, a place to show your share of history.',
    middleware: 'private-route',
});

</script>

<template>
    <NuxtLayout name="private-route">
        <template #title>
            Account
        </template>

        <template #header>
            
        </template>

        <template #noScrollMain>
        
        </template>
        
        <template #scrollMain>
            <PagesUsersUserBadges :userId="user.id" />
        </template>
    </NuxtLayout>
</template>

<style scoped>

</style>