<script setup>
const { t } = useI18n()
const title = ref('')
const description = ref('')
const selectedMetals = ref([])
const selectedImages = ref()
const selectedPeriod = ref()
const selectedType = ref()

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
        title: title.value,
        description: description.value,
        type: selectedType.value,
        dating_range_from: dating.value.range.from,
        dating_range_to: dating.value.range.to,
        metals: parsedMetals.value,
        dating_period: selectedPeriod.value,
        dating_year_marked: dating.value.markedYear
    });
}

function stringifiedMetaData() {
    const meta = {
        collection: 'Finds',
        images: []
    };

    if(selectedImages.value?.length) {
        for(let i = 0; i < selectedImages.value.length; i++ ) {
            meta.images[i] = {
                key: `image${i}`,
                collection: "Finds_images"
            };
        }
    }

    return JSON.stringify(meta);
}

const isPending = ref()

async function saveNewFind() {

    // if(isPending.value === true) return
    // isPending.value = true
    const fD = new FormData();
    fD.append('meta', stringifiedMetaData());
    fD.append('item', stringifiedFindItem());
    if(selectedImages.value?.length) {
        for(let i = 0; i < selectedImages.value.length; i++) {
            fD.append(`image${i}`, selectedImages.value[i]);
        }
    }
    
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

    if(res.ok) {
        useToaster("show", {
            id: "newFind",
            type: "success",
            autoClose: true,
            message: 'Votre trouvaille a été ajoutée avec succes !',
            position: "bottom"
        })

        isPending.value = false
        // navigateTo(`/finds/${res.data.id}`)
        navigateTo(`/home?content=finds`)
    } else {
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
            <TH2 class="sectionTitle">
                {{ t('page.finds.newFind.sections.description.title') }}
            </TH2>

            <div class="section">
                <!-- <PagesFindsNewFormTitle
                    v-model="title"
                /> -->
                <PagesFindsNewFormDescription
                    v-model="description"
                />
                <PagesFindsNewFormType
                    v-model="selectedType"
                />
                <PagesFindsNewFormMetals
                    v-model="selectedMetals"
                />
            </div>
        </ArchitecturePanelMain>
            
        <ArchitecturePanelMain>
            <TH2 class="sectionTitle">
                {{ t('page.finds.newFind.sections.dating.title') }}
            </TH2>

            <div class="section">
                <PagesFindsNewFormDating
                    v-model="dating"
                />

                <PagesFindsNewFormPeriod
                    v-model="selectedPeriod"
                />
            </div>
        </ArchitecturePanelMain>

        <ArchitecturePanelMain>
            <TH2 class="sectionTitle">
                Images
            </TH2>

            <div class="section">
                <PagesFindsNewFormImages
                v-model="selectedImages"
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