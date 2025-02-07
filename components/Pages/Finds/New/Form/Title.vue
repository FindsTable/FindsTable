<script setup>
const { t } = useI18n()
const title = defineModel()
</script>

<template>
    <FormsLabel>
        <template #label>
            {{ t('page.finds.newFindForm.fields.title.label') }}
        </template>
            
        <template #input>
            <FormsInput
                type="text"
                :placeholder="t('page.finds.newFindForm.fields.title.placeholder')"
                :minlength="3"
                :maxlength="50"
                spellcheck
                v-model="title"
            >
            </FormsInput>
        </template>
    </FormsLabel>
</template>