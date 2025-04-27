<script setup lang="ts">

definePageMeta({
  title: 'Create a new Hunt Report',
  description: 'Share your exploration adventures on Finds Table.',
  middleware: 'private-route'
})
</script>

<template>
  <NuxtLayout name="private-route">

    <template #title>
      Create a New Hunt Report
    </template>

    <template #scrollMain>
      <ContentHuntReportsNewMain />
    </template>

  </NuxtLayout>
</template>