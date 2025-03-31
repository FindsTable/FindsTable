<script setup>
const title = ref('')
const selectedMetals = ref([])
const selectedImages = ref()
const selectedPeriod = ref()

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
        dating_range_from: dating.value.range.from,
        dating_range_to: dating.value.range.to,
        metals: parsedMetals.value,
        dating_period: selectedPeriod.value,
        dating_year_marked: dating.value.markedYear,
        // dating_year_from: dating.value.range.from,
        // dating_year_to: dating.value.range.to
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
                collection: "Finds_files"
            };
        }
    }

    return JSON.stringify(meta);
}

async function saveNewFind() {
    const fD = new FormData();
    fD.append('meta', stringifiedMetaData());
    fD.append('item', stringifiedFindItem());
    if(selectedImages.value?.length) {
        for(let i = 0; i < selectedImages.value.length; i++) {
            fD.append(`image${i}`, selectedImages.value[i]);
        }
    }
    

    const res = await $fetch(
        '/api/items/finds/create',
        {
            method: 'POST',
            headers: {
                authorization: `Bearer ${useUserState().value.accessToken.value}`
            },
            body: fD
        }
    )
    console.log(res)
}
</script>

<template>
    <ArchitecturePanelMain>
        <TH2>
            Tell us about your find
        </TH2>

        <p>
            {{ {
                title, selectedMetals,selectedImages,selectedPeriod
            } }}
        </p>
        
        <form class="flex column gap20 marTop20">
            <PagesFindsNewFormTitle
                v-model="title"
            />

            <PagesFindsNewFormImages
                v-model="selectedImages"
            />

            <PagesFindsNewFormDating
                v-model="dating"
            />

            <PagesFindsNewFormPeriod
                v-model="selectedPeriod"
            />

            <PagesFindsNewFormMetals
                v-model="selectedMetals"
            />

            <template class="centered">
                <button 
                    @click.prevent="saveNewFind"
                    class="comp-button -filled"
                >
                    Submit
                </button>
            </template>
        </form>
    </ArchitecturePanelMain>
</template>

<style scoped>
.fieldSetTitle {
    font-size: 18px;
    font-weight: 700;
}
</style>