<script setup>
const modalState = useModalState()
const { cancel } = useModal()
</script>

<template>
    <div class="backdrop theme-modalBackdrop full centered" @click="cancel">
        <div 
            @click.stop
            class="modal flex column alignCenter" 
        >
            <ArchitecturePanelMain
                class="w100 h100 flex column"
            >
                <div class="w100">
                    <div class="w100 flex justifyEnd">
                        <Icon
                            @click.prevent="cancel()"
                            name="close"
                            size="22px"
                            class="pointer"
                        />
                    </div>

                    <h2 class="theme-titleColor-main font-h2" v-if="modalState.content.title">
                        {{ modalState.content.title }}
                    </h2>

                    <p 
                        v-if="modalState.content.message"
                        class="theme-textColor-main marTop20"
                    >
                        {{ modalState.content.message }}
                    </p>
                </div>

                <div class="marTop10 grow">
                    <ArchitectureOverlayModalsCropper
                        v-if="modalState.component === 'cropper'" 
                        class="marTop50"
                    />

                    <ArchitectureOverlayModalsComponentViewerMain
                        v-if="modalState.modal === 'ComponentViewer'"
                    />

                    <ArchitectureOverlayModalsFindSelector
                        v-if="modalState.modal === 'ArchitectureOverlayModalsFindSelector'"
                    />

                    <ArchitectureOverlayModalsCreateNewMedia
                        v-if="modalState.modal === 'ArchitectureOverlayModalsCreateNewMedia'"
                    />

                    <ArchitectureOverlayModalsNewThought
                        v-if="modalState.modal === 'NewThought'"
                    />
                </div>
            </ArchitecturePanelMain>
            
        </div>
    </div>
</template>

<style scoped>
.backdrop {
    opacity: 1;
    isolation: isolate;
    transition: 1500ms ease;
}
.modal {
    width: min(350px, 100%);
    height: min(650px, 100vh);
    padding: 30px;
    border-radius: 10px;
}
</style>