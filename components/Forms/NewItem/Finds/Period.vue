<script setup>
const { t, locale } = useI18n();
const datingPeriods = ref(null)
const selectedPeriod = defineModel()

async function getDatingPeriods() {
    try {
        const res = await $fetch(
        'https://admin.findstable.net/items/Dating_periods',
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
    datingPeriods.value = await getDatingPeriods()
})
</script>

<template>
    <fieldset class="marTop20">
        <FormsLabel>
            <template #label>
                Period
            </template>
            
            <template #input>
                <select 
                    v-if="datingPeriods"
                    class="inputTypeText" 
                    name="datingPeriod" 
                    id="datingPeriod" 
                    v-model="selectedPeriod"
                >
                    <option
                        v-for="period in datingPeriods" :key="period.id" 
                        :value="period.id"
                        class="inputTypeText"
                    >
                        {{ period.value }}
                    </option>
                </select>
            </template>
        </FormsLabel>
    </fieldset>
</template>