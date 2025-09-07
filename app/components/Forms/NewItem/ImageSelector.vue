<script setup lang="ts">
/**
 * FormsNewItemImageSelector
 * - Wraps <FormsInputFile/> and formats incoming files.
 * - Shows per-file tiles: spinner while processing → preview when done.
 * - Exposes:
 *     - formattedImages (readonly<File[]>)
 *     - isProcessing (readonly<boolean>)
 *     - waitUntilProcessingTrue(): Promise<void>
 *     - waitUntilProcessingFalse(): Promise<void>
 *     - clearAll(): void
 */

import type { 
    ComponentPublicInstance 
} from 'vue'

import type { 
    FilePickerComponent
} from '@@/app/components/Forms/FilePicker.vue'

import {
    imageFormatPresets
} from '#shared/imageFormatPresets'

import type {
    ImageFormatPresetKey
} from '#shared/imageFormatPresets'

export type {
    ImageSelectorComponent
}

type ExposedImage = {
    id: string;
    error: string | null
    previewUrl: string | null,
    file: File
}

interface ExposedData {
  images: Readonly<ExposedImage[]>;
  isProcessing: Readonly<boolean>;
  clearAll: () => void;
}

type ImageSelectorComponent = ComponentPublicInstance<{}, {}, ExposedData>;

const { t } = useI18n()
const props = defineProps({
    label: {
        type: String
    },
    maxImageCount: { 
        type: Number, 
        default: 1 
    },
    imageFormatPresetKey: { 
        type: String as PropType<ImageFormatPresetKey>, 
        default: 'bootyPhoto' 
    },
    disabled: { 
        type: Boolean, 
        default: false 
    },
    allowedFileTypes: { 
        type: String, 
        default: 'image/*' 
    },
    boxHeight: { 
        type: String, 
        default: '120px' 
    },
    aspectRatio: { 
        type: String, 
        default: '1/1' 
    },
    pickerIcon: { 
        type: String, 
        default: 'imageAdd' 
    },
    pickerLabelKey: { 
        type: String, 
        default: 'forms.inputs.file.image.label' 
    },
})

const picker = ref<FilePickerComponent | null>(null)
const exposedImages = ref<ExposedImage[]>([])

/** Processing state exposed to parent */
const isProcessing = ref(false)

/** Receive raw files from the picker and process them */
async function onFilesSelected(files : File[]) {
    if (
        !files?.length || 
        props.disabled ||
        isProcessing.value
    ) {
        return
    }

    isProcessing.value = true

    // populate exposedImages to show empty cards in the UI
    for(const file of files) {
        if(exposedImages.value.length >= props.maxImageCount) {
            break
        }

        exposedImages.value.push({
            id: crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
            error: null,
            previewUrl: '',
            file: file
        })
    }

    //process files and
    for(const image of exposedImages.value) {
        if(image.previewUrl) continue

        const formatedFile : File = await useApplyImageFormatPreset(props.imageFormatPresetKey, image.file)
        console.log(formatedFile)
        image.file = formatedFile
        image.previewUrl = URL.createObjectURL(image.file)
    }

    isProcessing.value = false
}

function deleteExposedImageAtIndex(index : number) {
    const image = exposedImages.value[index]
    if (!image) return
    if (image.previewUrl) {
            try { URL.revokeObjectURL(image.previewUrl) } catch {}
    }

    exposedImages.value.splice(index, 1)
}

function clearAll() {
    for(const image of exposedImages.value) {
        if(image.previewUrl) {
            try { URL.revokeObjectURL(image.previewUrl) } catch {}
        }
        
    }
    exposedImages.value = []
}

function openPickerDialog() {
    picker.value?.openFileDialog?.();
}

defineExpose({
    images: readonly(exposedImages),
    isProcessing: readonly(isProcessing),
    clearAll,
})

onBeforeUnmount(clearAll)
</script>

<template>
    <div class="flex column gap10">
        <!-- Horizontal scroll strip -->
        <div 
            class="flex gap10 marTop10" 
            style="overflow-x:auto; -webkit-overflow-scrolling: touch;"
        >
        <!-- Existing items -->
            <div
                v-for="(image, idx) in exposedImages" :key="image.id"
                class="centered imageBox allEvents"
                :style="{ height: boxHeight, aspectRatio }"
            >
                <!-- Done -->
                <template v-if="image.previewUrl">
                    <img 
                        :src="image.previewUrl" 
                        class="selectedImage"
                    />
                    
                    <div 
                        class="flex alignCenter gap5" 
                        style="position:absolute; right:6px; top:6px;"
                    >
                        <button
                            @click.prevent="deleteExposedImageAtIndex(idx)"
                            class="comp-button -text fS12"
                        >
                            Delete
                        </button>
                    </div>
                </template>

                <!-- Error -->
                <div 
                    v-else-if="image.error" 
                    class="flex column centered gap5 pad10" 
                    style="height:100%;"
                >
                    <Icon name="error" size="22px" />

                    <span class="fS12">
                        {{ image.error }}
                    </span>

                    <button 
                        @click.prevent="deleteExposedImageAtIndex(idx)"
                        class="comp-button -text fS12 marTop5"
                    >
                        Remove
                    </button>
                </div>

                <!-- Pending -->
                <div 
                    v-else
                    class="flex column centered gap5" 
                    style="height:100%;"
                >
                    <div class="spinner" aria-hidden="true"></div>

                    <span class="fS12">Processing…</span>
                </div>
            </div>

            <!-- Add another image frame -->
            <div
                v-if="!disabled && exposedImages.length < maxImageCount"
                class="imageBox centered pointer allEvents"
                :style="{ height: boxHeight, aspectRatio }"
                @click="openPickerDialog"
            >
                <Icon :name="pickerIcon" size="60px" class="defaultImage" />
            </div>
        </div>

    <!-- Actions -->
        <div class="flex gap10 marTop10">
            <FormsFilePicker
                ref="picker"
                :label="label"
                :multiple="maxImageCount > 1"
                :accept="allowedFileTypes"
                :disabled="disabled || exposedImages.length >= maxImageCount"
                :icon="pickerIcon"
                @files="onFilesSelected"
                class="allEvents"
            />

            <button
                    v-if="exposedImages.length > 0"
                    class="comp-button -text pointer"
                    @click.prevent="clearAll"
            >
                <span>
                    clear {{exposedImages.length > 1 ? 'all' : ''}}
                </span>
            </button>
        </div>
    </div>
</template>

<style scoped>
.imageBox {
  background-color: var(--tone-grayscale-70);
  border-radius: 5px;
  overflow: hidden;
  box-shadow: inset 0 0 5px black;
  position: relative;
  min-width: 140px;
}
.selectedImage { width: 100%; height: 100%; object-fit: cover; }
.defaultImage { opacity: 0.25; }
.disabled { opacity: 0.5; pointer-events: none; }

.spinner {
  width: 28px; height: 28px;
  border: 3px solid rgba(255,255,255,0.35);
  border-top-color: rgba(255,255,255,0.9);
  border-radius: 50%;
  animation: spin 0.9s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>
