<script setup lang="ts">
const state = defineModel<string>()

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
    <div class="flex marTop10 w100">
        <div
            class="draft statusLabel flex justifyEnd"
            :class="{ 
                active: state === 'draft' 
            }"
        >
            <span>
                Save as draft
            </span>
        </div>

        <div class="">
            <FormsSwitch
                :model-value="state === 'published'"
                @update:model-value="toggleStatus"
            />
        </div>

        <div
            class="published statusLabel"
            :class="{ 
                active: state === 'published' 
            }"
        >
            <span>
                Publish
            </span>
        </div>
    </div>
</template>

<style scoped>
.statusLabel {
    font-size: 16px;
    opacity: 0.5;
    transition: 200ms;
    flex-grow: 1;
    flex-shrink: 0;
    position: relative;
}
.statusLabel.active {
    opacity: 1;
    font-weight: bold;
}
.statusLabel > span {
    padding: 0px 10px;
    position: absolute;
}
.draft.active {
    color: var(--tone-mango-20);
}
.published.active {
    color: var(--color-ft-light);
}
</style>