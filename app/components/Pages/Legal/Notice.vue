<script setup>
const { t } = useI18n()
</script>

<template>
  <TH1 class="marTop20">
    {{ t("legalNotice.title") }}
  </TH1>

  <p class="font-text marTop10">
    {{ t("legalNotice.lastUpdated") }} : <b>{{ useAppConfig().legalNoticeLastUpdate }}</b>
  </p>

  <TH2 class="marTop20">
    {{ t("legalNotice.sections.generalDisclaimer.title") }}
  </TH2>
  <p class="font-text marTop10">
    {{ t("legalNotice.sections.generalDisclaimer.text") }}
  </p>

  <TH2 class="marTop20">
    {{ t("legalNotice.sections.userSubmittedContent.title") }}
  </TH2>
  <p class="font-text marTop10">
    {{ t("legalNotice.sections.userSubmittedContent.text") }}
  </p>

  <TH2 class="marTop20">
    {{ t("legalNotice.sections.licenseToUse.title") }}
  </TH2>
  <p class="font-text marTop10">
    {{ t("legalNotice.sections.licenseToUse.text") }}
  </p>

  <TH2 class="marTop20">
    {{ t("legalNotice.sections.codeOfConduct.title") }}
  </TH2>
  <p class="font-text marTop10">
    {{ t("legalNotice.sections.codeOfConduct.text") }}
  </p>

  <TH2 class="marTop20">
    {{ t("legalNotice.sections.additionalProvisions.title") }}
  </TH2>
  <p class="font-text marTop10">
    {{ t("legalNotice.sections.additionalProvisions.text") }}
  </p>

  <TH2 class="marTop20">
    {{ t("legalNotice.sections.severabilityAndLiability.title") }}
  </TH2>
  <p class="font-text marTop10">
    {{ t("legalNotice.sections.severabilityAndLiability.text") }}
  </p>

  <p class="font-text marTop20">
    {{ t("legalNotice.consent") }}
  </p>
</template>

<style scoped>
ul {
  padding-left: 30px;
}
</style>
