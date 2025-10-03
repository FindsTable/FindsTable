<script setup>
const { t } = useI18n()
const route = useRoute()

definePageMeta({
    title: 'Finds Table',
    description: 'Finds Table, a place to show your share of history.',
});
</script>

<template>
    <NuxtLayout name="public-route">
        <div 
            class="grow flex alignCenter"
        >
            <ArchitecturePanelMain>
                <ArchitectureAppStructureBoxesMainElement>
                    <TH1 class="banner centered theme-textColor-soft">
                        Finds Table
                    </TH1>
                </ArchitectureAppStructureBoxesMainElement>

                <ArchitectureAppStructureBoxesMainElement>
                    <TH1
                        class=""
                    >
                        {{ t('page.redirection.newAccountCreated.success') }}
                    </TH1>
                </ArchitectureAppStructureBoxesMainElement>

                <ArchitectureAppStructureBoxesMainElement
                    class="flex column alignCenter"
                >
                    <div
                        class="h100 centered"
                    >
                        <Icon 
                            name="enveloppeChecked"
                            size="5vw"
                        />
                    </div>

                    <p
                        class="marTop20"
                    >
                        {{ t('page.redirection.newAccountCreated.checkYourEmails') }}
                    </p>
                </ArchitectureAppStructureBoxesMainElement>
                
                <ArchitectureAppStructureBoxesMainElement>
                    <div class="centered marTop20">
                        <NuxtLink class="pointer comp-button -filled" to="/">
                            {{ t('page.redirection.newAccountCreated.toIndex') }}
                        </NuxtLink>
                    </div>
                </ArchitectureAppStructureBoxesMainElement>
            </ArchitecturePanelMain>
        </div>
    </NuxtLayout>
</template>

<style scoped>
.banner {
    font-family: var(--typeface-findsTable);
    font-size: 3rem;
    padding: 20px;
    border-radius: 10px;
    object-fit: cover;
    background-image: url("/images/chemin-creux.jpg");
    background-position: bottom;
    background-blend-mode: multiply;
}
</style>