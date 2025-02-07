<script setup>
const hasMarkedDate = ref(false)

const dating = ref({
    broadPeriod: null,
    century: null,
    year: null,
    month: null,
    date: null,
    day: null,
    dateComment: null,
})

</script>

<template>
    <div>
        <div class='flex alignCenter gap20'>
            
            <p>
                Marked date on the find
            </p>
            
            <FormsSwitch v-model="hasMarkedDate" />
        </div>

        <div v-if="hasMarkedDate">
            <FormsLabel>
                <template #label>
                    Year
                </template>

                <template #input>
                    <FormsInput
                        type="number"
                        max="2024"
                        step="1"
                        v-model="dating.year"
                    />
                </template>
            </FormsLabel>
        </div>
    </div>
</template>