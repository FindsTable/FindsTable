<script setup>
const { t, locale } = useI18n();
const selectedMetals = defineModel()
const metals = ref([])

async function getMetals() {
    try {
        const res = await $fetch(
        'https://admin.findstable.net/items/Metals',
        {
            method: 'GET',
            headers: {
                authorization: `Bearer ${useUserState().value.accessToken.value}`
            }
        })
        return res?.data ? res.data : null
    } catch(e) {
        console.log(e)
    }
}
function handleClick(metalId) {
    if(selectedMetals.value.includes(metalId)) {
        selectedMetals.value = selectedMetals.value.filter(id => id !== metalId)
    } else {
        selectedMetals.value.push(metalId)
    }
}

onMounted(async () => {
    metals.value = await getMetals()
})
</script>

<template>
    <fieldset class="marTop20">
        <legend class="standardLabel">
            {{ t('page.finds.newFind.sections.description.fields.metals.label') }}
        </legend>

        <div class="flex wrap gap20 marTop20">
            <div
                v-for="metal in metals"
                :key="metal.id"
                :for="`metalCheckbox-${metal.id}`"
                class="metalTouchArea cutoutContainer pad10 flex alignCenter gap10 pointer"
                :class="{ 'selected': selectedMetals.includes(metal.id) }"
                @click="handleClick(metal.id)"
            >
                <span>{{ metal.name || metal.id }}</span>
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
.metalTouchArea.selected .customCheckBox::after {
    background-color: #555;
    box-shadow: inset 2px 2px 6px black;
}
</style>