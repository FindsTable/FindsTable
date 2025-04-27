<script setup lang="ts">
const model = defineModel<File[] | null>()
const { t } = useI18n()

const props = defineProps({
  maxFiles: {
    type: Number,
    default: 1
  },
  boxHeight: {
    type: String,
    default: '100px' // e.g., '100px', '150px'
  },
  aspectRatio: {
    type: String,
    default: '1/1' // e.g., '1/1' for square, '4/3' for photos
  },
  titlePath: {
    type: String,
    default: "Image"
  }
})

const inputField = ref()

const fileUrls = computed<string[]>(() => {
  if (!model.value) return []
  return model.value.map(file => URL.createObjectURL(file))
})

async function handleFile(file: File) {
  if (!file) return

  model.value = model.value || []
  await nextTick()

  if (model.value.length >= props.maxFiles) {
    return
  }

  model.value = [...model.value, file]
}

function deleteImage(index: number) {
  if (!Array.isArray(model.value)) return
  model.value.splice(index, 1)
}

</script>

<template>
  <div class="marTop20">
    <TH2 class="sectionTitle">
        {{ t(`${titlePath}`) }}
    </TH2>

    <div class="flex gap10 wrap marTop10">
        <div 
            v-for="(slot, index) in props.maxFiles" 
            :key="index"
            class="flex column gap5 alignCenter"
        >
            <div 
                @click="inputField?.openFileDialog()"
                class="imageBox centered pointer"
                :style="{
                    height: props.boxHeight,
                    aspectRatio: props.aspectRatio
                }"
            >
            <img 
                v-if="fileUrls[index]"
                :src="fileUrls[index]"
                alt=""
                class="selectedImage"
            >
                <Icon 
                    v-else
                    class="defaultImage" 
                    name="imageDefault" 
                    size="60px" 
                />
            </div>

            <button 
                @click.prevent="deleteImage(index)"
                    class="comp-button -text font-text-main fS12"
                    :class="!fileUrls[index] ? 'disabled' : ''"
                >
                Unselect
            </button>
        </div>
    </div>

    <div class="flex">
      <FormsInputFile 
        @newFile="handleFile"
        fileType="image"
        ref="inputField"
        label="forms.inputs.file.image.label"
        icon="imageAdd"
        :class="model?.length === maxFiles ? 'disabled' : ''"
      />
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
}

.defaultImage {
  opacity: 0.2;
}

.selectedImage {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.disabled {
    opacity: 0;
    pointer-events: none;
}
</style>