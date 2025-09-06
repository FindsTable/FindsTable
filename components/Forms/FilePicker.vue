<script setup lang="ts">
import type { 
    ComponentPublicInstance 
} from 'vue'

export type  {
    FilePickerComponent
}
// typing of the component
type FilePickerComponent = ComponentPublicInstance<{}, {}, {
    openFileDialog: () => void;
}>;

/**
 * Stateless file picker
 * - Emits `files` with an array of File objects on each selection.
 * - No internal state; resets input after emit so same file can be reselected.
 * - Exposes `openFileDialog()` for parent-triggered opens.
 */

const { t } = useI18n()

const props = defineProps({
    multiple: { 
        type: Boolean, 
        default: false 
    },
    accept:   { 
        type: String, 
        default: 'image/*' 
        },
    capture:  { 
        type: [Boolean, String] as PropType<boolean | "environment" | "user">,
        default: 'environment' // e.g., 'environment' or 'user' (mobile)
    }, 
    disabled: { 
        type: Boolean, 
        default: false 
    },
    label:    { 
        type: String, 
        default: 'forms.inputs.file.image.label' 
    },
    icon:     { 
        type: String, 
        default: '' 
    },
})

const emit = defineEmits<{
  (e: 'files', files: File[]): void
}>()

const nativeInput = ref<HTMLInputElement | null>(null)

function openFileDialog() {
    if (props.disabled) return
    nativeInput.value?.click()
}

function handleNewFile() {
    if (props.disabled) return

    const files = Array.from(nativeInput.value?.files ?? [])

    if (files.length) emit('files', files)

    // clear so selecting the same file triggers another change
    if (nativeInput.value) {
        nativeInput.value.value = ''
        nativeInput.value.blur?.()
    }
}

defineExpose({ 
    openFileDialog
})



</script>

<template>
  <label class="relative comp-button -text pointer">
    <span class="flex alignCenter gap10"> 
      <Icon v-if="icon" :name="icon" size="20px" />
      
      <span class="text">{{ t(label) }}</span>
    </span>

    <input
      ref="nativeInput"
      type="file"
      :multiple="multiple"
      :disabled="disabled"
      :accept="accept"
      :capture="capture"
      @change="handleNewFile"
    />
  </label>
</template>

<style scoped>
input {
  display: none;
  position: absolute;
  pointer-events: none;
}
.text { font-size: 12px; }
</style>