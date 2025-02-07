<script setup>
import {
    ArchitecturePageSectionsH2Panel as H2Panel
} from '#components'
const { t } = useI18n();
</script>

<template>
    <H2Panel>
        <template #H2>
            {{ t('page.settings.tabs.app.sections.colorMode.title') }}
        </template>

        <template #content>
            <div>
                <WidgetsColorModeToggler fullHeight />
            </div>
        </template>
    </H2Panel>
</template>