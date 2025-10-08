<script setup>
const { t } = useI18n()
const title = ref('')
const description = ref('')
const selectedMetals = ref([])
const selectedPeriod = ref()
const selectedType = ref()
const me = useUserState()

const findImageSelectorComponent = ref(null)

const findImages = computed(() => {
    return findImageSelectorComponent.value?.images || []
})

const dating = ref({
    markedYear: null,
    range: { 
        from: null, 
        to: null 
    }
})

const parsedMetals = computed(() => {
    if(!selectedMetals.value.length) return []
    const _metals = [ ...selectedMetals.value ]

    const parsed = _metals.map((metal) => {
        return {
            Metals_id: metal
        }
    })
    return parsed
})

function stringifiedFindItem() {
    
    return JSON.stringify({
    // ⛑️ Dirty hack alert:
    // Directus regex validation fails when `title === ""`, even if it's allowed.
    // To bypass this, we force a single space to avoid empty string rejection.
    // Ideally this should be fixed by using JS validation or backend-side sanitation.
        title: title.value + " ",
        description: description.value + " ",
    // ⛑️
        type: selectedType.value,
        dating_range_from: dating.value.range.from,
        dating_range_to: dating.value.range.to,
        metals: parsedMetals.value,
        dating_period: selectedPeriod.value,
        dating_year_marked: dating.value.markedYear
    });
}

const isPending = ref()

async function saveNewFind() {
    if(isPending.value === true) return
    isPending.value = true

    const fD = new FormData()
    fD.append('item', stringifiedFindItem())
    
    // Add images if they exist, keeping the original indices
    // image0 and image1 will be undefined if no image at that index
    if(findImages.value[0].file) {
        fD.append('image0', findImages.value[0]?.file || undefined)
    }
    if(findImages.value[1].file) {
        fD.append('image1', findImages.value[1]?.file || undefined)
    }

    try {
        const newFindId = await $fetch(
            '/api/content/finds/create',
            {
                method: 'POST',
                headers: {
                    authorization: `Bearer ${me.value.accessToken.value}`
                },
                body: fD
            }
        )

        useToaster("show", {
            id: "newFind",
            type: "success",
            autoClose: true,
            message: 'Votre trouvaille a été ajoutée avec succes !',
            position: "bottom"
        })

        isPending.value = false

        navigateTo(`/users/${me.id}/Finds/${newFindId}`)

    } catch(err) {
        useHandleError(err)
        isPending.value = false
    }

    isPending.value = false

}

const formRef = ref()

</script>

<template>
    <form class="flex column" ref="formRef">
        <ArchitectureAppStructureBoxesMainElement>
            <ArchitecturePanelMain> 
                <TH2 class="sectionTitle">
                    {{ t('page.finds.newFind.sections.description.title') }}
                </TH2>

                <FormsNewItemTitle 
                    v-model="title"
                    textPath="page.finds.newFind.sections.description.fields.title.label"
                />
                <FormsNewItemDescription
                    v-model="description"
                    textPath="page.finds.newFind.sections.description.fields.description.label"
                />
                <FormsNewItemFindsType
                    v-model="selectedType"
                />
                <FormsNewItemFindsMetals
                    v-model="selectedMetals"
                />
            </ArchitecturePanelMain>
        </ArchitectureAppStructureBoxesMainElement>
            
        <ArchitectureAppStructureBoxesMainElement>
            <ArchitecturePanelMain>
                <TH2 class="sectionTitle">
                    {{ t('page.finds.newFind.sections.dating.title') }}
                </TH2>

                <FormsNewItemFindsDating
                    v-model="dating"
                />
            </ArchitecturePanelMain>
        </ArchitectureAppStructureBoxesMainElement>

        <ArchitectureAppStructureBoxesMainElement>
            <ArchitecturePanelMain>
                <TH2 class="sectionTitle">
                    Images
                </TH2>

                <FormsNewItemImageSelector
                    ref="findImageSelectorComponent"
                    :label="t('add images')"
                    :maxImageCount="2"
                    imageFormatPresetKey="find"
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
            <template class="centered">
                <button 
                    @click.prevent="saveNewFind"
                    class="font-h2 comp-button -filled marTop50"
                >
                    {{ t('components.button.submit') }}
                </button>
            </template>
        </ArchitectureAppStructureBoxesMainElement>
        
    </form>
</template>

<style scoped>
.sectionTitle {
    padding-bottom: 5px;
    border-bottom: 1px solid var(--surface1-borderColor);
    margin-bottom: 10px;
}


</style>