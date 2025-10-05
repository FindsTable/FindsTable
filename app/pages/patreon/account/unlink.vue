<script setup>
const me = useUserState()

</script>

<template>
    <NuxtLayout name="private-route">
        <template #title>
            <ArchitectureAppStructureBoxesMainElement>
                Unlink your account
            </ArchitectureAppStructureBoxesMainElement>

            
        </template>

        <template #noScrollMain> 
            
        </template>

        <template #scrollMain>
            <ArchitectureAppStructureBoxesMainElement>
                <ArchitecturePanelMain>
                    If you unlink your account, you will loose all benefits.

                    <div class="centered">

                    </div>
                </ArchitecturePanelMain>
            </ArchitectureAppStructureBoxesMainElement>
        </template>
    </NuxtLayout>
</template>