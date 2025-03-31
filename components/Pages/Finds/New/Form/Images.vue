<script setup>
const selectedImages = defineModel()
const localFiles = ref([null, null])

const fileInputs = {
  1: ref(null),
  2: ref(null)
}

function getfileUrl(file) {
  return window.URL.createObjectURL(file)
}

const { openModal } = useModal()

const handleFile = async (event, index) => {
  const file = event.target.files[0]
  if (!file) {
    return
  }
//   if (file.size > 10 * 1024 * 1024) {
//     console.log('File is too big')
//     return
//   }

  // Crop the image before assigning
  const croppedFile = await openImageInCropperModal(file)
  if (!croppedFile) return

  localFiles.value[index] = croppedFile
  selectedImages.value = localFiles.value.filter(Boolean)
  event.target.value = null
}

const openImageInCropperModal = async (file) => {
  try {
    const url = getfileUrl(file)
    const newFile = await openModal({
      component: 'cropper',
      data: url,
      content: {
        title: 'Image Cropper',
        message: 'Please resize your avatar to fit in the red frame',
      },
      options: {
        croppingSize: {
            width: 1080,
            height: 1080
        }
      }
    })
    return newFile
  } catch (e) {
    console.warn('Cropping cancelled or failed:', e)
    return null
  }
}

const removeFile = (index) => {
  localFiles.value[index] = null
  selectedImages.value = localFiles.value.filter(Boolean)
}

const triggerFileInput = (index) => {
  fileInputs[index]?.click()
}
</script>

<template>
  <fieldset>
    <legend>Add images</legend>

    <div class="flex gap10">
      <div
        v-for="(file, index) in localFiles"
        :key="index"
        class="upload-slot relative"
      >
        <button
          class="upload-button"
          type="button"
          @click="triggerFileInput(index)"
        >
          <template v-if="file">
            <img :src="getfileUrl(file)" alt="preview" />
            <span class="delete-icon" @click.stop="removeFile(index)">
              <Icon name="delete" />
            </span>
          </template>

          <template v-else>
            <Icon name="plus" class="plus-icon" />
          </template>
        </button>
      </div>
    </div>

    <!-- Hidden inputs under the slots -->
    <input
      v-for="(_, index) in localFiles"
      :key="'input-' + index"
      type="file"
      accept="image/*"
      class="visually-hidden"
      :ref="el => fileInputs[index] = el"
      @change="e => handleFile(e, index)"
    />
  </fieldset>
</template>

<style scoped>

.upload-slot {
  width: 120px;
  height: 120px;
  position: relative;
}

.upload-button {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  background: #383b32;
  box-shadow: inset 1px 1px 5px black;
  cursor: pointer;
  overflow: hidden;
  padding: 8px;
  position: relative;
  display: grid;
  place-items: center;
  transition: border-color 0.2s ease;
}
.upload-button img {
    box-shadow: 1px 1px 5px black;
}
.upload-button:hover {
  border-color: #888;
}

.upload-button img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.plus-icon {
  font-size: 24px;
  color: #666;
}

.delete-icon {
  position: absolute;
  top: 6px;
  right: 6px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  padding: 4px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.delete-icon:hover {
  background: rgba(255, 100, 100, 0.9);
}

.visually-hidden {
  position: absolute;
  left: -9999px;
}
</style>
