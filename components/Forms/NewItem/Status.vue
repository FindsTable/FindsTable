<script setup lang="ts">
const state = defineModel<string>('state')
const { t } = useI18n()

const props = defineProps({
  textPath: {
    type: String,
    default: ''
  }
})

const { openModal } = useConfirmationModal()

async function toggleStatus() {
  const confirmChange = await openModal({
    title: state.value === 'draft' ? 'Publish this report?' : 'Move back to draft?',
    message: state.value === 'draft'
      ? 'Your report will be available to others when you post it.'
      : 'Your report will be saved as a darft.'
  })

  if (!confirmChange) {
    return
  }

  state.value = state.value === 'draft' ? 'published' : 'draft'

  useToaster('show', {
    id: crypto.randomUUID(),
    message: state.value === 'published'
      ? 'Your hunt report is now published!'
      : 'Your hunt report is now a draft.',
    type: 'success',
    autoClose: true,
    position: 'bottom'
  })
}
</script>

<template>
    <div>
        <TH2 class="sectionTitle">
            {{ t(`${textPath}`) }}
        </TH2>
        
        <div class="flex alignCenter gap10 marTop10">
            <div
                class="statusLabel"
                :class="{ active: state === 'draft' }"
            >
                Draft
            </div>

            <FormsSwitch
                :model-value="state === 'published'"
                @update:model-value="toggleStatus"
            />

            <div
                class="statusLabel"
                :class="{ active: state === 'published' }"
            >
                Published
            </div>
        </div>
    </div>
</template>

<style scoped>
.statusLabel {
  font-size: 16px;
  opacity: 0.5;
  transition: 200ms;
}
.statusLabel.active {
  opacity: 1;
  font-weight: bold;
}
</style>