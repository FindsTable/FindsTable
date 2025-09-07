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
 */

import type { 
    ComponentPublicInstance 
} from 'vue'

import type { 
    FilePickerComponent
} from '@/components/Forms/FilePicker.vue'

import type {
    ImageFormatPreset,
    ImageFormatPresetKey
} from '@@/shared/imageFormatPresets'

export type {
    ImageSelectorComponent
}

interface ExposedData {
  images: Readonly<ExposedImage[]>
  isProcessing: Readonly<boolean>
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
    showImageSlots: {
        type: Boolean,
        default: false
    },
    showFilePicker: {
        type: Boolean,
        default: true
    }
})

const picker = ref<FilePickerComponent | null>(null)
const exposedImages = ref<ExposedImage[]>([])

/** Processing state exposed to parent */
const isProcessing = ref(false)

type ExposedImage = {
    id?: string
    error: string | null
    previewUrl: string | null
    file: File | null
    slot: {
        state: 'emptySlot' | 'processing' | 'image' | 'error',
        index: number | null
    }
}

const newExposedImage = (
    p: ExposedImage
): ExposedImage => {

    const newImg = {
        id: crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
        ...p
    }

    return newImg
}

const targetSlotIndex = ref<number | null>(null)

/** Receive raw files from the picker and process them */
async function onFilesSelected(files: File[]) {
    if (!files?.length || props.disabled || isProcessing.value) {
        return;
    }

    isProcessing.value = true;

    // If a specific slot is targeted
    if (
        targetSlotIndex.value !== null &&
        targetSlotIndex.value >= 0 &&
        targetSlotIndex.value < exposedImages.value.length &&
        files[0]
    ) {
        const targetImage = exposedImages.value[targetSlotIndex.value];
        if (targetImage) {
            targetImage.slot.state = 'processing'; // Set the state to 'processing' to show the spinner
            const formattedImage: File = await useApplyImageFormatPreset(props.imageFormatPresetKey, files[0]);
            targetImage.file = formattedImage;
            targetImage.previewUrl = URL.createObjectURL(formattedImage);
            targetImage.slot.state = 'image';
        }

        isProcessing.value = false;
        return;
    }

    // Populate exposedImages dynamically if slots are not defined
    for (const file of files) {
        if (exposedImages.value.length >= props.maxImageCount) {
            break;
        }

        exposedImages.value.push({
            id: crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
            error: null,
            previewUrl: '',
            file: file,
            slot: {
                state: 'processing',
                index: null,
            },
        });
    }

    // Process files and update preview URLs
    for (const image of exposedImages.value) {
        if (image.previewUrl) continue;

        const formattedFile: File = await useApplyImageFormatPreset(props.imageFormatPresetKey, image.file);
        image.file = formattedFile;
        image.previewUrl = URL.createObjectURL(image.file);
        image.slot.state = 'image';
    }

    isProcessing.value = false;
}

function deleteExposedImageAtIndex(index : number) {
    if(props.showImageSlots) {
        const targetSlot = exposedImages.value[index]
        if(targetSlot) {
            targetSlot.file = null
            targetSlot.previewUrl = null
            targetSlot.slot.state = 'emptySlot'
            targetSlot.error = null
        }
        return
    }
    const image = exposedImages.value[index]
    if (!image) return
    if (image.previewUrl) {
            try { URL.revokeObjectURL(image.previewUrl) } catch {}
    }

    exposedImages.value.splice(index, 1)
}

function openPickerDialog(slotIndex : number | null) {
    // in case of predefined slots
    if(slotIndex !== null) {
        targetSlotIndex.value = slotIndex
    }
    picker.value?.openFileDialog?.();
}

defineExpose({
    images: readonly(exposedImages),
    isProcessing: readonly(isProcessing)
})

onBeforeUnmount(() => {
    exposedImages.value.forEach((image) => {
        if (image.previewUrl) {
            try {
                URL.revokeObjectURL(image.previewUrl);
            } catch (error) {
                console.error('Failed to revoke object URL:', error);
            }
        }
    });
});

onMounted(() => {
    console.log(props.showImageSlots)
    if(props.showImageSlots) {
        for(let i = 0; i < props.maxImageCount; i++) {
            exposedImages.value.push(newExposedImage({
                    previewUrl: null,
                    error: null,
                    file: null,
                    slot: {
                        state: 'emptySlot',
                        index: i
                    }      
                }
            ))
        }
    }
})

function setAsPrimary(event : Event, index: number) {
    console.log(index, exposedImages.value.length)
    if (index === 0 || index < 0 || index >= exposedImages.value.length) {
        return
    }

    // Move the selected image to index 0
    const [selectedImage] = exposedImages.value.splice(index, 1)

    if (!selectedImage) {
        return
    }

    exposedImages.value.unshift(selectedImage)

    // If slots are enabled, update slot.index for all images
    if (props.showImageSlots) {
        exposedImages.value.forEach((image, idx) => {
            if (image.slot) {
                image.slot.index = idx;
            }
        })
    }
}
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
                class="centered imageBox allEvents relative"
                :class="image.slot.state !== 'processing' ? 'pointer' : ''"
                :style="{ height: boxHeight, aspectRatio }"
                @click="openPickerDialog(image.slot.index)"
            >
                <!-- Image is available -->
                <template v-if="image.slot.state === 'image'">
                    <img 
                        v-if="image.previewUrl"
                        :src="image.previewUrl" 
                        class="selectedImage"
                    />
                    
                    <div 
                        class="absolute top0 flex justifyBetween w100"
                    >
                        <button
                            @click.stop.prevent="deleteExposedImageAtIndex(idx)"
                            class="comp-button -text fS12"
                        >
                            <Icon 
                                :name="idx === 0 ? 'starFull' : 'starEmpty'" 
                                @click.stop.prevent="setAsPrimary($event, idx)"
                            />
                        </button>

                        <button
                            @click.stop.prevent="deleteExposedImageAtIndex(idx)"
                            class="comp-button -text fS12"
                        >
                            <Icon name="delete" />
                        </button>
                    </div>
                </template>

                <!-- Error -->
                <div 
                    v-else-if="image.slot.state === 'error'" 
                    class="full flex column centered gap5 pad10" 
                >
                    <Icon name="error" size="22px" />

                    <span class="fS12">
                        {{ image.error }}
                    </span>

                    <button 
                        @click.stop.prevent="deleteExposedImageAtIndex(idx)"
                        class="comp-button -text fS12 marTop5"
                    >
                        Remove
                    </button>
                </div>

                <!-- is processing -->
                <div 
                    v-else-if="image.slot.state === 'processing'"
                    class="full centered" 
                >
                    <div class="spinner" aria-hidden="true"></div>
                </div>

                <!-- empty slot -->
                <div 
                    v-else-if="image.slot.state === 'emptySlot'"
                    class="h100 flex column centered gap5" 
                >
                    <Icon :name="pickerIcon" size="60px" class="defaultImage" />
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
                :disabled="disabled"
                :icon="pickerIcon"
                @files="onFilesSelected"
                class="allEvents"
                :class="!showFilePicker ? 'hiddenFilePicker' : ''"
            />
        </div>
    </div>
</template>

<style scoped>

.hiddenFilePicker {
    position: absolute;
    opacity: 0;
    pointer-events: none;
}

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
