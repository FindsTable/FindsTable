<script setup>
const { t } = useI18n();

</script>
<template>
    <footer class="flex justifyCenter gap20 wrap">
        <NuxtLink class="comp-button -text-small pointer theme-buttonText -hoverable" to="/">
            welcome
        </NuxtLink>

        <NuxtLink class="comp-button -text-small pointer theme-buttonText -hoverable" to="/privacy">
            {{ t('page.privacy.title') }}
        </NuxtLink>

        <NuxtLink class="comp-button -text-small pointer theme-buttonText -hoverable" to="/legal-notice">
            {{ t('page.legalNotice.title') }}
        </NuxtLink>
    </footer>
</template>