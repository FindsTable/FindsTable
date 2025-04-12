<script setup>
const { t } = useI18n()
const description = defineModel()
</script>

<template>
    <FormsLabel>
        <template #label>
            {{ t('page.finds.newFind.sections.description.title') }}
        </template>
            
        <template #input>
            <textarea
                v-model="description"
                class="font-input-text theme-inputText-bgColor theme-textColor-main inputTypeText"
            >

            </textarea>
        </template>
    </FormsLabel>
</template>

<style scoped>
textarea {
    width: 100%;
    height: 50px;
    padding: 10px;
    border: none;
    border-radius: 5px;
    resize: vertical;
    transition: all 350ms ease;
}
/* textarea:focus {
    height: 250px;
} */
</style>