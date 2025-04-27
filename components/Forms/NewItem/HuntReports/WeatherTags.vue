<script setup lang="ts">
const tags = defineModel<string[]>('tags')

// Get available weather tags from app content
const appContent = useAppContent()
const availableTags = computed(() => appContent.value.weatherTags || [])

// Handle click
function toggleTag(selectedKey: string) {
  if (!Array.isArray(tags.value)) {
    tags.value = []
  }
  const index = tags.value.indexOf(selectedKey)
  if (index !== -1) {
    tags.value = tags.value.filter(t => t !== selectedKey) // unselect
  } else {
    tags.value = [...tags.value, selectedKey] // select
  }
}

// Check if a tag is selected
function isSelected(key: string) {
  return Array.isArray(tags.value) && tags.value.includes(key)
}

// Get translated label
function getTagLabel(tag: any) {
  const translation = tag.translations.find(t => t.value)
  return translation?.value || tag.key
}
</script>

<template>
    <div class="flex wrap gap10 marTop10">
      <div
        v-for="tag in availableTags"
        :key="tag.key"
      >
        <button
          type="button"
          @click.prevent="toggleTag(tag.key)"
          class="comp-button"
          :class="isSelected(tag.key) ? '-filled' : '-text'"
        >
          {{ getTagLabel(tag) }}
        </button>
      </div>
    </div>
  </template>