<script setup lang="ts">
const { t } = useI18n()

definePageMeta({
  title: 'Create a new Hunt Report',
  description: 'Share your exploration adventures on Finds Table.',
  middleware: 'private-route'
})
</script>

<template>
  <NuxtLayout name="private-route">

    <template #title>
      {{t('page.huntReports.newReport.title')}}
    </template>

    <template #header>
        {{t('page.huntReports.newReport.pageLead')}}
    </template>

    <template #scrollMain>
      <ContentHuntReportsNewMain />
    </template>

  </NuxtLayout>
</template>