<script setup>
const { t } = useI18n()
definePageMeta({
    middleware: 'private-route'
});
</script>

<template>
    <NuxtLayout name="private-route">
        <template #header>
            <LazyArchitecturePageHeaderIconAndTitle
                iconName="badges"
                :title="t('page.badges.title')"
            />

            <ArchitectureAppStructureBoxesMainElement>
                <ArchitecturePanelMain>
                    <TH2>
                        {{ t('page.badges.pageLead') }}
                    </TH2>
                </ArchitecturePanelMain>
            </ArchitectureAppStructureBoxesMainElement>
        </template>
        
        <template #scrollMain>
            <ArchitectureAppStructureBoxesMainElement>
                <ArchitecturePanelMain>
                    <ContentBadgesStore />
                </ArchitecturePanelMain>
            </ArchitectureAppStructureBoxesMainElement>
        </template>
    </NuxtLayout>
</template>