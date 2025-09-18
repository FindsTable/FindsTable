<script setup>
const modalState = useConfirmationModalState()
const { confirm, cancel } = useConfirmationModal()
</script>

<template>
    <div class="full centered backdrop theme-modalBackdrop">
        <ArchitecturePanelMain class="centered">
            <p clas="font-h1">
                {{ modalState.title }}
            </p>

            <p class="font-pageLead">
                {{ modalState.message }}
            </p>

            <div class="flex justifyCenter gap20 marTop20">
                <button class="comp-button -filled" @click="confirm">
                    confirm
                </button>

                <button class="comp-button -filled" @click="cancel">
                    cancel
                </button>
            </div>
        </ArchitecturePanelMain>
    </div>
</template>