<script setup lang="ts">
import type {
    ImageSelectorComponent
} from '@@/app/components/Forms/NewItem/ImageSelector.vue'

const me = useUserState()

const { t } = useI18n()
const bootyPhotoSelector = ref<ImageSelectorComponent | null>(null)

const isPending = ref(false)
const bootyPhotoIsProcessing = computed(() => bootyPhotoSelector.value?.isProcessing || false)

// Form fields

//status is set based on the value of the exposed computedProperty 
const statusSwitchComponent = ref()
const status = computed(() => {
    if(statusSwitchComponent.value?.status) {
        return statusSwitchComponent.value.status
    }

    return 'draft'
})
const date = ref('')
const title = ref('')
const content = ref('')
const biome = ref<string | undefined>(undefined)
const weatherTags = ref<string[]>([])

// Access exposed data from FormsNewItemImageSelector
const bootyPhoto = computed(() => bootyPhotoSelector.value?.images?.[0] || null)

const finds = ref<any[]>([])

// Validation errors
const errors = ref<Record<string, string>>({
    title: '',
    content: '',
    biome: '',
    weatherTags: '',
    banner: '',
    bootyPhoto: ''
})

function isValidImageFile(fileType: string | undefined | null): boolean {
    if (!fileType) return false

    return fileType === 'image/webp'
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
        errors.value.biome = 'A valid biome must be selected.'
    }
    if (!date.value) {
        errors.value.biome = 'A valid date must be selected.'
    }
    /*
        if (!Array.isArray(weatherTags.value) || weatherTags.value.some(tag => !appContent.weatherTags.includes(tag))) {
            errors.value.weatherTags = 'All weather tags must be valid.'
        }
    */
    if (bootyPhoto.value?.file) {
        if(!isValidImageFile(bootyPhoto.value.file.type)) {
            errors.value.bootyPhoto = 'Booty photo must be a JPG or PNG image.';
        }
    }
    
    // Show all errors
    const errorMessages = Object.values(errors.value).filter(msg => msg)

    if (errorMessages.length > 0) {
        errorMessages.forEach(message => {
            useToaster('show', {
                id: crypto.randomUUID(),
                message : '',
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
    // if (
    //     isPending.value ||
    //     bootyPhotoIsProcessing.value
    // ) return

    // isPending.value = true
    
    // validateForm()

    // if (!formIsValid.value) {
    //     isPending.value = false
    //     return
    // }

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
    if (bootyPhoto.value?.file) {
        formData.append('bootyPhoto', bootyPhoto.value.file)
    }

    try {
        // Send POST request
        const reportId = await $fetch(
            '/api/content/hunt-reports/create',
            {
                method: 'POST',
                headers: {
                    'authorization': `Bearer ${useUserState().value.accessToken.value}`
                },
                body: formData
            }
        )

        useToaster('show', {
            id: crypto.randomUUID(),
            message: "Hunt report created succesfully !",
            icon: 'success',
            type: 'success',
            autoClose: true,
            position: 'bottom'
        })

        navigateTo(`/users/${me.value.id}/Hunt_reports/${reportId}`)

    } catch(err) {
        useHandleError(err)
    }

    isPending.value = false
}
</script>

<template>
    <form class="flex column marTop20" ref="formRef">
        <ArchitectureAppStructureBoxesMainElement>
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
        </ArchitectureAppStructureBoxesMainElement>
        
        <ArchitectureAppStructureBoxesMainElement>
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
        </ArchitectureAppStructureBoxesMainElement>
    
        <ArchitectureAppStructureBoxesMainElement>
            <ArchitecturePanelMain>
                <TH2 class="sectionTitle">
                    Empy your poutch !
                </TH2>

                <Tp>
                    Add a photo of all your findings. Nails, coins, b.o.a.t., etc ...
                </Tp>

                <FormsNewItemImageSelector
                    ref="bootyPhotoSelector"
                    :label="t('page.huntReports.newReport.fields.bootyPhoto.label')"
                    :maxImageCount="1"
                    imageFormatPresetKey="bootyPhoto"
                    :disabled="isPending"
                    :boxHeight="'140px'"
                    aspectRatio="1/1"
                    class="marTop10"
                    :showImageSlots="true"
                    :showFilePicker="false"
                />
            </ArchitecturePanelMain>
        </ArchitectureAppStructureBoxesMainElement>
    
        <ArchitectureAppStructureBoxesMainElement>
            <ArchitecturePanelH2Panel>
                <template #H2>
                    {{ t('page.huntReports.newReport.fields.relatedFinds.label') }}
                </template>
                
                <template #content>
                    {{ t('page.huntReports.newReport.fields.relatedFinds.lead') }}
                    <div class="section">
                        <FormsNewItemRelatedFinds
                            buttonTextPath="page.huntReports.newReport.fields.relatedFinds.button"
                            v-model="finds"
                            :addedFinds="finds"
                        />
                    </div>
                </template>
            </ArchitecturePanelH2Panel>
        </ArchitectureAppStructureBoxesMainElement>
  
        <template class="centered">
            <FormsNewItemStatus
                ref="statusSwitchComponent"
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

<style scoped>


</style>