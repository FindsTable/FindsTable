<script setup>
const { t } = useI18n()
</script>

<template>
  <TH1 class="marTop20">
    {{ t("privacy.title") }}
  </TH1>

  <p class="font-text marTop10">
    {{ t("privacy.lastUpdated") }} : <b>{{ useAppConfig().privacyLastUpdate }}</b>
  </p>

  <TH2 class="marTop20">
    {{ t("privacy.sections.intro.title") }}
  </TH2>
  <p class="font-text marTop10">
    {{ t("privacy.sections.intro.text") }}
  </p>

  <TH2 class="marTop20">
    {{ t("privacy.sections.dataCollection.title") }}
  </TH2>
  <p class="font-text marTop10">
    {{ t("privacy.sections.dataCollection.text") }}
  </p>

  <TH2 class="marTop20">
    {{ t("privacy.sections.dataStorage.title") }}
  </TH2>
  <p class="font-text marTop10">
    {{ t("privacy.sections.dataStorage.text") }}
  </p>

  <TH2 class="marTop20">
    {{ t("privacy.sections.recommendation.title") }}
  </TH2>
  <p class="font-text marTop10">
    {{ t("privacy.sections.recommendation.text") }}
  </p>

  <p class="font-text marTop20">
    {{ t("privacy.consent") }}
  </p>
</template>

<style scoped>
ul {
  padding-left: 30px;
}
</style>
