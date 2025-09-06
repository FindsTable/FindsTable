<script setup>
const { t } = useI18n()
const route = useRoute()

definePageMeta({
    title: 'Finds Table',
    description: 'Finds Table, a place to show your share of history.',
});
</script>

<template>
    <NuxtLayout name="public-route">
        <h1>
            {{ t('page.redirection.newAccountCreated.title') }}
        </h1>

        <p>
            {{ t('page.redirection.newAccountCreated.success') }}
        </p>
        <p>
            {{ t('page.redirection.newAccountCreated.checkYourEmails') }}
        </p>

        <div class="centered">
            <NuxtLink class="pointer comp-button -filled" to="/">
                {{ t('page.redirection.newAccountCreated.toIndex') }}
            </NuxtLink>
        </div>
    </NuxtLayout>
</template>