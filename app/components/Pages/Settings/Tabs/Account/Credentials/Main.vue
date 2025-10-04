<script setup>
import { 
    ArchitecturePanelH2Panel as H2Panel,
    PagesSettingsTabsAccountCredentialsPersonalDataField as PersonalDataField,
    PagesSettingsTabsAccountCredentialsBasicInfoField as BasicInfoField
 } from '#components';

const  { t } = useI18n()
const me = useUserState()

</script>

<template>
    <H2Panel>
        <template #H2>
            Basic information
        </template>

        <template #content>
            <p class="font-pageLead">
                {{ t('page.settings.tabs.account.sections.credentials.basicInfoIntroText') }}
            </p>

            <div class="flex column gap30 marTop20">
                <BasicInfoField 
                    :fieldData="{
                        key: 'username',
                        value: me.username.slice(1)
                    }"
                    prefix="@"
                />

                <BasicInfoField 
                    :fieldData="{
                        key: 'displayName',
                        value: me.displayName
                    }"
                />
            </div>
        </template>
    </H2Panel>

    <H2Panel>
        <template #H2>
            {{ t('page.settings.tabs.account.sections.credentials.title') }} :
        </template>

        <template #content>
            <p class="font-pageLead">
                {{ t('page.settings.tabs.account.sections.credentials.personalDataIntroText') }}
            </p>

            <div class="flex column gap30 marTop20">
                <PersonalDataField 
                    :fieldData="me.personalDataRecord.email"
                />

                <PersonalDataField 
                    :fieldData="me.personalDataRecord.firstName"
                />

                <PersonalDataField 
                    :fieldData="me.personalDataRecord.lastName"
                />

                <PersonalDataField 
                    :fieldData="me.personalDataRecord.country"
                />
            </div>
        </template>
    </H2Panel>
</template>

<style scoped>

</style>