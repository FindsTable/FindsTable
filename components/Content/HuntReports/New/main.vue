<script setup lang="ts">
const { t } = useI18n()

// Form fields
const status = ref('draft')
const date = ref('')
const title = ref('')
const content = ref('')
const biome = ref<string>('')
const weatherTags = ref<string[]>([])
const banner = ref<File[]>([])
const bootyPhoto = ref<File[]>([])
const finds = ref<FindId[]>([])
const photos = ref<File[]>([])

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
function isValidImageFile(file: File | undefined | null): boolean {
    if (!file) return false

    const allowedTypes = ['image/jpeg', 'image/png']
    const maxSizeInBytes = 1 * 1024 * 1024 // 1 MB

    return (
        allowedTypes.includes(file.type) &&
        file.size <= maxSizeInBytes
    )
}
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
    if (!biome.value) {
        console.log(biome.value)
        errors.value.biome = 'A valid biome must be selected.'
    }
    if (!Array.isArray(weatherTags.value) || weatherTags.value.some(tag => !appContent.weatherTags.includes(tag))) {
        errors.value.weatherTags = 'All weather tags must be valid.'
    }
    if (!Array.isArray(banner.value) || banner.value.length === 0) {
        errors.value.banner = 'Banner must be a JPG or PNG image.'
    }
    if (!Array.isArray(bootyPhoto.value) || bootyPhoto.value.length === 0 || !isValidImageFile(bootyPhoto.value[0])) {
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

async function saveNewReport() {
    validateForm()

    if (!formIsValid.value) {
        return
    }

    const { directFetch } = useDirectAsyncFetch()

    const formData = new FormData()

    // Prepare the hunt report object
    const reportPayload = {
        status: status.value,
        title: title.value + " ", // Dirty hack: avoid empty string Directus validation issue
        content: content.value + " ", // Same hack
        date: date.value,
        biome: biome.value,
        weatherTags: weatherTags.value,
        finds: finds.value,
    }

    formData.append('report', JSON.stringify(reportPayload))

    // Attach images
    if (banner.value.length > 0) {
        formData.append('banner', banner.value[0])
    }
    if (bootyPhoto.value.length > 0) {
        formData.append('bootyPhoto', bootyPhoto.value[0])
    }

    // ⚡️ You said for now we **don't upload** photos array
    // formData.append('photos', ???)

    // Send POST request
    const { 
        response, 
        error, 
        isPending 
    } = await directFetch(
        'POST', '/api/content/hunt-reports/new/post',
        {
            body: formData
        }
    )

    if (error.value) {
        useToaster('show', {
            id: crypto.randomUUID(),
            message: 'Failed to save your report',
            icon: 'error',
            type: 'error',
            autoClose: true,
            position: 'bottom'
        })
        return
    }

    if (response.value) {
        useToaster('show', {
            id: crypto.randomUUID(),
            message: 'Hunt report saved!',
            icon: 'success',
            type: 'success',
            autoClose: true,
            position: 'bottom'
        })
    }
}
</script>

<template>
    <form class="flex column gap20 marTop20" ref="formRef">
        <ArchitecturePanelMain>
            <div class="section flex column gap20">
                <FormsNewItemTitle 
                    v-model="title"
                    textPath="page.huntReports.newReport.fields.title.label"
                    placeholderPath="page.huntReports.newReport.fields.title.placeholder"
                />
    
                <FormsNewItemDescription 
                    v-model="content"
                    textPath="page.huntReports.newReport.fields.content.label"
                />
    
                <FormsNewItemDate 
                    v-model="date"
                    labelPath="page.huntReports.newReport.fields.date.label"
                />
            </div>
        </ArchitecturePanelMain>
    
        <ArchitecturePanelMain>
            <div class="section">
                <FormsNewItemBiome 
                    v-model="biome"
                        labelPath="page.huntReports.newReport.fields.biome.label"
                        multiple
                />

                <FormsNewItemHuntReportsWeatherTags
                    v-model="weatherTags"
                    textPath="page.huntReports.newReport.fields.weatherTags.label"
                />
            </div>
        </ArchitecturePanelMain>
    
        <ArchitecturePanelMain>
            <div class="section">

                <FormsNewItemImageSelector 
                    v-model="banner"
                    label="banner image"
                    :maxFiles="1"
                    boxHeight="100px"
                    aspectRatio="5/2"
                    titlePath="page.huntReports.newReport.fields.banner.label"
                />
                
                <FormsNewItemImageSelector 
                    v-model="bootyPhoto"
                    label="Booty Photo"
                    :maxFiles="1"
                    titlePath="page.huntReports.newReport.fields.bootyPhoto.label"
                />

                <FormsNewItemImageSelector 
                    v-model="photos" 
                    label="Booty Photo"
                    :maxFiles="3"
                    titlePath="page.huntReports.newReport.fields.photos.label"
                />
            </div>
        </ArchitecturePanelMain>
    
        <ArchitecturePanelMain>
            <div class="section">
                <FormsNewItemRelatedFinds
                    labelPath="page.huntReports.newReport.fields.relatedFinds.label"
                    leadPath="page.huntReports.newReport.fields.relatedFinds.lead"
                    buttonTextPath="page.huntReports.newReport.fields.relatedFinds.button"
                    v-model="finds"
                />
            </div>
        </ArchitecturePanelMain>
  
        <template class="centered">
            <FormsNewItemStatus 
                v-model="status"
                textPath="page.huntReports.newReport.fields.status.label"
            />

            <button 
                @click.prevent="saveNewReport"
                class="font-h2 comp-button -filled marTop50"
            >
                {{ t('components.button.submit') }}
            </button>
        </template>
    </form>
  </template>