<script setup>
const { t } = useI18n()
definePageMeta({
    middleware: 'private-route'
});
</script>

<template>
    <NuxtLayout name="private-route">
        <template #title>
            <ArchitectureAppStructureBoxesMainElement>
                {{ t('page.badges.title') }}
            </ArchitectureAppStructureBoxesMainElement>
            
        </template>
        
        <template #header>
            <ArchitectureAppStructureBoxesMainElement>
                <TH2 class="marTop20">
                    {{ t('page.badges.pageLead') }}
                </TH2>
            </ArchitectureAppStructureBoxesMainElement>
        </template>
        
        <template #scrollMain>
            <ContentBadgesStore />
        </template>
    </NuxtLayout>
</template>