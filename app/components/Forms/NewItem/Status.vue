<script setup lang="ts">
const { t } = useI18n()


const switchState = ref<boolean>(false)
const status = computed( () => {

    return switchState.value 
        ? 'published'
        : 'draft'
})

defineExpose({
    status
})

const props = defineProps({
  textPath: {
    type: String,
    default: ''
  }
})

const { openModal } = useConfirmationModal()

async function toggleStatus() {

    console.log(switchState.value)
    
    const confirmChange = await openModal({
        title: switchState.value
            ? 'Move back to draft?'
            : 'Publish this report?',
        message: switchState.value
            ? 'Your report will be saved as a draft.'
            : 'Your report will be available to others when you post it.'
    })

    if (!confirmChange) {
        return
    }

    switchState.value = !switchState.value
}

</script>

<template>
    <div class="flex marTop10 w100">
        <div
            class="draft statusLabel flex justifyEnd"
            :class="{ 
                active: !switchState 
            }"
        >
            <span>
                Save as draft
            </span>
        </div>

        <div class="">
            <FormsSwitchBasic
                :state="switchState"
                @click="toggleStatus"
            />
        </div>

        <div
            class="published statusLabel"
            :class="{ 
                active: switchState
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