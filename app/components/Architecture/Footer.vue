<script setup>
const { t } = useI18n();

</script>
<template>
    <footer class="flex justifyCenter gap50 wrap">
        <NuxtLink class="comp-button comp-button -text" to="/">
            welcome
        </NuxtLink>

        <NuxtLink class="comp-button comp-button -text" to="/privacy">
            {{ t('page.privacy.title') }}
        </NuxtLink>

        <NuxtLink class="comp-button comp-button -text" to="/legal-notice">
            {{ t('page.legalNotice.title') }}
        </NuxtLink>
    </footer>
</template>