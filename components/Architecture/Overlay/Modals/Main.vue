<script setup>
const modalState = useModalState()
const { cancel } = useModal()

</script>

<template>
    <div class="backdrop full centered" @click="cancel">
        <div 
            @click.stop
            class="modal comp-panel -surface1 flex column alignCenter" 
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

                <h1 class="theme-titleColor-main font-h1" v-if="modalState.content.title">
                    {{ modalState.content.title }}
                </h1>

                <p class="theme-textColor-main font-pageLead marTop20" v-if="modalState.content.message">
                    {{ modalState.content.message }}
                </p>
            </div>

            <div class="marTop20">
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
            </div>
        </div>
    </div>
</template>

<style scoped>
.backdrop {
    background-color: rgba(0, 0, 0, 0.85);
    isolation: isolate;
}
.modal {
    width: min(auto, 100%);
    padding: 30px;
    border-radius: 10px;
}

</style>