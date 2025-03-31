<script setup>
const hasMarkedDate = ref(false)
const dating = defineModel({ 
    type: Object, 
    default: () => ({
        markedYear: null,
        range: { 
            from: null, 
            to: null 
        }
    })
})

function handleClick() {
    // nullify unused values
    if(hasMarkedDate.value) {
        hasMarkedDate.value = false
        dating.value.markedYear = null
    } else {
        hasMarkedDate.value = true
        dating.value.range.from = null
        dating.value.range.to = null
    }
}
</script>

<template>
    <div class="flex alignCenter gap20">
        <p class="fieldSetTitle">
            Marked year on the find
        </p>

        <FormsSwitch @click="handleClick" />
    </div>

    <fieldset  v-if="hasMarkedDate">
        <FormsLabel>
            <template #label>
                Year
            </template>

            <template #input>
                <FormsInput
                    type="number"
                    :placeholder="1977"
                    :min="0"
                    :max="2025"
                    v-model="dating.markedYear"
                />
            </template>
        </FormsLabel>
    </fieldset>

    <fieldset v-else class="marTop20">
        <p class="fieldSetTitle">Define a range of years</p>

        <div class="marTop20 flex gap20">
            <FormsLabel>
                <template #label>from</template>
                <template #input>
                    <FormsInput
                        type="number"
                        :placeholder="1890"
                        :min="0"
                        :max="2025"
                        v-model="dating.range.from"
                    />
                </template>
            </FormsLabel>

            <FormsLabel>
                <template #label>to</template>
                <template #input>
                    <FormsInput
                        type="number"
                        :placeholder="1890"
                        :min="0"
                        :max="2025"
                        v-model="dating.range.to"
                    />
                </template>
            </FormsLabel>
        </div>
    </fieldset>
</template>