<script setup>
const { t, locale } = useI18n();
const selectedType = defineModel()
const types = ref(null)

const queryFields = [
    'id', 'value', "translations.*", "translations.Languages_id.*"
]

async function getTypes() {
    try {
        const res = await $fetch(
        'https://admin.findstable.net/items/Find_types',
        {
            method: 'GET',
            headers: {
                authorization: `Bearer ${useUserState().value.accessToken.value}`
            },
            query: {
                fields: queryFields.join(','),
                deep: {
                    translations: {
                        _filter: {
                            Languages_id: {
                                code: {
                                    _eq: locale.value
                                }
                            }
                        }
                    }
                }
            }
        })
        return res?.data ? res.data : null
    } catch(e) {
        console.log(e)
    }
}

onMounted(async () => {
    types.value = await getTypes()
})

function handleCLick(typeId) {
    if(selectedType.value === typeId) {
        selectedType.value = ''
    } else {
        selectedType.value = typeId
    }
    
}

</script>

<template>
    <fieldset class="marTop20" v-if="types">
            <legend class="standardLabel">
                {{ t('page.finds.newFind.sections.description.fields.type.label') }}
            </legend>

            <div class="flex wrap gap20 marTop20">

                <div
                    v-for="type in types"
                    :key="type.id"
                    :for="`metalCheckbox-${type.id}`"
                    class="metalTouchArea cutoutContainer pad10 flex alignCenter gap10 pointer"
                    :class="{ 'selected': selectedType === type.id }"
                    @click="handleCLick(type.id)"
                >
                    <span>{{ type.translations[0].name || type.value }}</span>
                </div>

            </div>
        </fieldset>
</template>

<style scoped>
.inputCheckBox {
    opacity: 0;
    position: absolute;
    pointer-events: none;
}
.metalTouchArea {
    flex-shrink: 0;
    width: 20%;
}
/* .customCheckBox {
    height: 48px;
    aspect-ratio: 1;
    position: relative;
    isolation: isolate;
} */
/* .customCheckBox::after {
    content: "";
    border-radius: 5px;
    background-color: gray;
    box-shadow: inset 1px 1px 5px black;
    position: absolute;
    inset: 6px;
} */
.checkIcon {
    position: absolute;
    inset: 10px 12px 12px 11px;
    z-index: 1000;
    opacity: 0;
}
.metalTouchArea.selected .customCheckBox::after {
    background-color: #555;
    box-shadow: inset 2px 2px 6px black;
}
</style>