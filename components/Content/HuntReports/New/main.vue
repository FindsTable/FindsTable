<script setup lang="ts">
const { t } = useI18n()

// Form fields
const status = ref('')
const date = ref('')
const title = ref('')
const content = ref('')
const biome = ref('')
const weatherTags = ref<string[]>([])
const banner = ref<File | null>(null)
const bootyPhoto = ref<File | null>(null)
const finds = ref<any[]>([])
const photos = ref<any[]>([])

// Dummy appContent (for now, you will implement it later)
const appContent = {
  biomes: ['forest', 'beach', 'mountain'],
  weatherTags: ['sunny', 'rainy', 'cloudy']
}

// Validation errors
const errors = ref<Record<string, string>>({
  title: '',
  content: '',
  biome: '',
  weatherTags: '',
  banner: '',
  bootyPhoto: ''
})

function validateForm() {
  // Reset all errors
  for (const key in errors.value) {
    errors.value[key] = ''
  }

  // Validation checks
  if (!title.value || title.value.length > 50) {
    errors.value.title = 'Title must be provided and less than 50 characters.'
  }
  if (!content.value || content.value.length > 2000) {
    errors.value.content = 'Content must be provided and less than 2000 characters.'
  }
  if (!biome.value || !appContent.biomes.includes(biome.value)) {
    errors.value.biome = 'A valid biome must be selected.'
  }
  if (!Array.isArray(weatherTags.value) || weatherTags.value.some(tag => !appContent.weatherTags.includes(tag))) {
    errors.value.weatherTags = 'All weather tags must be valid.'
  }
  if (!banner.value || !isValidImageFile(banner.value)) {
    errors.value.banner = 'Banner must be a JPG or PNG image.'
  }
  if (!bootyPhoto.value || !isValidImageFile(bootyPhoto.value)) {
    errors.value.bootyPhoto = 'Booty photo must be a JPG or PNG image.'
  }

  // Show all errors
  const errorMessages = Object.values(errors.value).filter(msg => msg)

  if (errorMessages.length > 0) {
    errorMessages.forEach(message => {
      useToaster('show', {
        id: crypto.randomUUID(),
        message,
        icon: 'error',
        type: 'error',
        autoClose: true,
        position: 'bottom'
      })
    })
    return
  }
}

const formIsValid = computed(() => {
  return Object.values(errors.value).every(error => error === '')
})

// Helper
function isValidImageFile(file: File | null) {
  if (!file || !file.type) return false
  return file.type === 'image/jpeg' || file.type === 'image/png'
}

function saveNewReport() {
    
}
</script>

<template>
    <form class="flex column gap20 marTop20" ref="formRef">
      <ArchitecturePanelMain>
        <div class="section flex column gap20">
          <FormsNewItemTitle v-model="title" />
  
            <FormsNewItemDescription 
                v-model="content"
                textPath="page.huntReports.newReport.sections.description.fields.description.label"
            />
  
            <FormsNewItemDate 
                v-model="date"
                textPath="page.huntReports.newReport.sections.description.fields.date.label"
            />
  
            <FormsNewItemStatus 
                v-model="status"
                textPath="page.huntReports.newReport.sections.description.fields.status.label"
            />
        </div>
      </ArchitecturePanelMain>
  
      <ArchitecturePanelMain>
        <div class="section">
          <FormsNewItemBiome 
            v-model="biome"
                textPath="page.huntReports.newReport.sections.description.fields.biome.label"
                multiple
            />
  
          <TH2 class="sectionTitle">
            {{ t('page.huntReports.newReport.sections.description.fields.weatherTags.label') }}
          </TH2>
          
          <FormsNewItemHuntReportsWeatherTags v-model="weatherTags" />
        </div>
      </ArchitecturePanelMain>
  
      <ArchitecturePanelMain>
        <div class="section">
          <TH2 class="sectionTitle">
            {{ t('page.huntReports.newReport.sections.images.fields.banner.label') }}
          </TH2>
          <FormsNewItemCroppedImage v-model="banner" label="Banner" />
  
          <TH2 class="sectionTitle">
            {{ t('page.huntReports.newReport.sections.images.fields.bootyPhoto.label') }}
          </TH2>
          <FormsNewItemCroppedImage v-model="bootyPhoto" label="Booty Photo" />
  
          <TH2 class="sectionTitle">
            {{ t('page.huntReports.newReport.sections.images.fields.photos.label') }}
          </TH2>
          <FormsNewItemCroppedImageGallery v-model="photos" label="Miscellaneous Photos" />
        </div>
      </ArchitecturePanelMain>
  
      <ArchitecturePanelMain>
        <div class="section">
          <TH2 class="sectionTitle">
            {{ t('page.huntReports.newReport.sections.finds.fields.finds.label') }}
          </TH2>
          <FormsNewItemFindSelector v-model="finds" />
        </div>
      </ArchitecturePanelMain>
  
      <template class="centered">
        <button 
          @click.prevent="saveNewReport"
          class="font-h2 comp-button -filled marTop50"
        >
          {{ t('components.button.submit') }}
        </button>
      </template>
  
    </form>
  </template>