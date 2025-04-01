<script setup>
const { t } = useI18n()

</script>

<template>
        <TH1 class="marTop20">
            {{ t("cookiePolicy.title") }}
        </TH1>

        <TH2 class="marTop20">
            {{ t("cookiePolicy.pageLead") }}
        </TH2>
        
        <p class="font-text marTop10">
            {{ t("cookiePolicy.lastUpdated") }} : <b>{{ useAppConfig().cookiePolicyLastUpdate }}</b>
        </p>

        <TH2 class="marTop20">
            {{ t("cookiePolicy.sections.whatAreCookies.title") }}
        </TH2>
        
        <p class="font-text marTop10">
            {{ t("cookiePolicy.sections.whatAreCookies.text") }}
        </p>

        <TH2 class="marTop20">
            {{ t("cookiePolicy.sections.howWeUseCookies.title") }}
        </TH2>
        
        <p class="font-text marTop10">
            {{ t("cookiePolicy.sections.howWeUseCookies.text") }}
        </p>

        <TH2 class="marTop20">
            {{ t("cookiePolicy.sections.ourCommitment.title") }}
        </TH2>
        
        <p class="font-text marTop10">
            {{ t("cookiePolicy.sections.ourCommitment.text") }}
        </p>

        <TH2 class="marTop20">
            {{ t("cookiePolicy.sections.manageCookies.title") }}
        </TH2>
        
        <p class="font-text marTop10">
            {{ t("cookiePolicy.sections.manageCookies.text") }}
        </p>

        <ul class="font-text marTop20">
            <li class="marTop10">
                <a class="pointer comp-button -outlined inlineBlock" href="{{ t('cookiePolicy.sections.manageCookies.links.chrome') }}">
                    Chrome
                </a>
            </li>

            <li class="marTop10">
                <a class="pointer comp-button -outlined inlineBlock" href="{{ t('cookiePolicy.sections.manageCookies.links.firefox') }}">
                    Firefox
                </a>
            </li>

            <li class="marTop10">
                <a class="pointer comp-button -outlined inlineBlock" href="{{ t('cookiePolicy.sections.manageCookies.links.safari') }}">
                    Safari
                </a>
            </li>

            <li class="marTop10">
                <a class="pointer comp-button -outlined inlineBlock" href="{{ t('cookiePolicy.sections.manageCookies.links.edge') }}">
                    Edge
                </a>
            </li>

            <li class="marTop10">
                <a class="pointer comp-button -outlined inlineBlock" href="{{ t('cookiePolicy.sections.manageCookies.links.opera') }}">
                    Opera
                </a>
            </li>
        </ul>

        <TH2 class="marTop20">
            {{ t("cookiePolicy.sections.furtherInformation.title") }}
        </TH2>
        
        <p class="font-text marTop10">
            {{ t("cookiePolicy.sections.furtherInformation.text") }}
        </p>


</template>

<style scoped>
ul {
    padding-left: 30px;
}
</style>