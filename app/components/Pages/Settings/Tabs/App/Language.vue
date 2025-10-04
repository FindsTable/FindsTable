<script setup>
import {
    ArchitecturePanelH2Panel as H2Panel
} from '#components'
const { t } = useI18n();
</script>

<template>
    <H2Panel>
        <template #H2>
            {{ t('page.settings.tabs.app.sections.language.title') }}
        </template>

        <template #content>
            <div>
                <WidgetsLanguageSelector class="marTop10" />
            </div>
        </template>
    </H2Panel>
</template>