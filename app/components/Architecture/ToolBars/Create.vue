<script setup>
const { t } = useI18n()
const { openModal } = useModal()

function handleClick() {
    openModal({
        modal: 'ArchitectureOverlayModalsCreateNewMedia'
    })
}
</script>

<template>
    <ArchitectureToolBarsTextIconButton
        @click.prevent="handleClick"
        :text="t('sideBarLinks.create')"
        iconName="create"
    />
</template>