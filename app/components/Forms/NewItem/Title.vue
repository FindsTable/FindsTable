<script setup>
const { t } = useI18n()
const title = defineModel()

const props = defineProps({
    textPath: String,
    placeholderPath: String
})

</script>

<template>
    <FormsLabel>
        <template #label>
            {{ t(`${textPath}`) }}
        </template>
            
        <template #input>
            <FormsInput
                type="text"
                :placeholder="t(`${placeholderPath}`)"
                :minlength="3"
                :maxlength="50"
                spellcheck
                v-model="title"
                class="-fontStyle-title"
            >
            </FormsInput>
        </template>
    </FormsLabel>
</template>