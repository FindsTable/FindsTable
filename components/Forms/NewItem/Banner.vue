<script setup lang="ts">
import { ref, computed } from 'vue'

const banner = defineModel<File | null>('banner')

const inputField = ref()

const fileUrl = computed<string | null>(() => {
  if (!banner.value) return null
  return URL.createObjectURL(banner.value)
})

async function handleFile(file: File) {
  if (!file) return
  banner.value = file
}
</script>

<template>
  <div class="marTop10">
    <div class="imageBox centered">
      <img 
        v-if="fileUrl"
        :src="fileUrl"
        alt=""
        class="selectedImage"
      >
      <Icon 
        v-else
        class="defaultImage" 
        name="imageDefault" 
        size="100px" 
      />
    </div>

    <div class="flex marTop10">
        <FormsInputFile 
        @newFile="handleFile"
        fileType="image"
        ref="inputField"
        label="forms.inputs.file.image.label"
        icon="imageAdd"
        />
    </div>
  </div>
</template>

<style scoped>
.imageBox {
  height: 100px;
  aspect-ratio: 5/2;
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
</style>