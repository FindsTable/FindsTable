<script setup>
const { t } = useI18n()
const title = ref('')
const description = ref('')
const selectedMetals = ref([])
const selectedPeriod = ref()
const selectedType = ref()

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
    fD.append('image0', findImages.value[0]?.file || undefined)
    fD.append('image1', findImages.value[1]?.file || undefined)
    
    const res = await $fetch(
        '/api/content/finds/create',
        {
            method: 'POST',
            headers: {
                authorization: `Bearer ${useUserState().value.accessToken.value}`
            },
            body: fD
        }
    )
    console.log(res)

    if(res.ok) {
        useToaster("show", {
            id: "newFind",
            type: "success",
            autoClose: true,
            message: 'Votre trouvaille a été ajoutée avec succes !',
            position: "bottom"
        })

        isPending.value = false
        navigateTo(`/finds/${res.data.id}`)
        navigateTo(`/home?content=finds`)
    } else {
        console.error('Error saving new find:', res);
        useToaster("show", {
            id: "newFind",
            type: "error",
            autoClose: true,
            message: res.statusText ?? 'An error has occured',
            position: "bottom"
        })
        isPending.value = false
    }
    isPending.value = false
}
const formRef = ref()

</script>

<template>
    <form class="flex column gap20 marTop20" ref="formRef">
        <ArchitecturePanelMain>
            <div class="section">
                <FormsNewItemDescription
                    v-model="description"
                    textPath="page.finds.newFind.sections.description.title"
                />
                <FormsNewItemFindsType
                    v-model="selectedType"
                />
                <FormsNewItemFindsMetals
                    v-model="selectedMetals"
                />
            </div>
        </ArchitecturePanelMain>
            
        <ArchitecturePanelMain>
            <TH2 class="sectionTitle">
                {{ t('page.finds.newFind.sections.dating.title') }}
            </TH2>

            <div class="section">
                <FormsNewItemFindsDating
                    v-model="dating"
                />

                <FormsNewItemFindsPeriod
                    v-model="selectedPeriod"
                />
            </div>
        </ArchitecturePanelMain>

        <ArchitecturePanelMain>
            <TH2 class="sectionTitle">
                Images
            </TH2>

            <div class="section">
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
            </div>
        </ArchitecturePanelMain>

        <template class="centered">
            <button 
                @click.prevent="saveNewFind"
                class="font-h2 comp-button -filled marTop50"
            >
                {{ t('components.button.submit') }}
            </button>
        </template>
    </form>
</template>

<style scoped>
.sectionTitle {
    padding-bottom: 5px;
    border-bottom: 1px solid gray;
    margin-bottom: 10px;
}
.section {
    margin-left: 5px;
}

</style>