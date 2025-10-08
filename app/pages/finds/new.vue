<script setup>
const { t } = useI18n()

definePageMeta({
    title: 'New Find',
    description: 'Add a new find to your collection',
    middleware: 'private-route',
});
</script>

<template>
    <NuxtLayout name="private-route">
        <template #title>
            <ArchitecturePageHeaderIconAndTitle
                iconName="content"
                title="New find"
            />
        </template>

        <template #header>
            <ArchitectureAppStructureBoxesMainElement>
                <ArchitecturePanelMain>
                    {{ t('page.finds.newFind.pageLead') }}
                </ArchitecturePanelMain>
            </ArchitectureAppStructureBoxesMainElement>
        </template>

        <template #noScrollMain>

        </template>

        <template #scrollMain>
            <LazyPagesFindsNewFormMain />
        </template>
    </NuxtLayout>
    
</template>