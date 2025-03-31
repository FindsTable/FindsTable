<script setup>
const selectedMetals = defineModel()
const metals = ref(null)

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

onMounted(async () => {
    metals.value = await getMetals()
})
</script>

<template>
    <fieldset class="marTop20">
            <legend class="fieldSetTitle">
                Metals
            </legend>

            <div class="flex wrap gap20 marTop20">

                <label
                    v-for="metal in metals"
                    :key="metal.id"
                    :for="`metalCheckbox-${metal.id}`"
                    class="metalTouchArea flex alignCenter gap10 pointer"
                    :class="{ 'selected': selectedMetals.includes(metal.id) }"
                >
                    <span class="customCheckBox">
                        <Icon class="checkIcon" name="check" :style="{ opacity: selectedMetals.includes(metal.id) ? 1 : 0 }" />
                    </span>

                    <span>{{ metal.name || metal.id }}</span>

                    <input
                        type="checkbox"
                        class="inputCheckBox"
                        :id="`metalCheckbox-${metal.id}`"
                        :value="metal.id"
                        v-model="selectedMetals"
                    />
                </label>

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
.customCheckBox {
    height: 48px;
    aspect-ratio: 1;
    position: relative;
    isolation: isolate;
}
.customCheckBox::after {
    content: "";
    border-radius: 5px;
    background-color: gray;
    box-shadow: inset 1px 1px 5px black;
    position: absolute;
    inset: 6px;
}
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