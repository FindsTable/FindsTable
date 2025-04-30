<script setup>
const props = defineProps({
    type: String,
    maxValue: Number,
    minValue: Number,
    step: Number,
    placeholder: String | Number,
    minlength: Number,
    maxlength: Number,
    spellcheck: Boolean,
})
const value = defineModel()
</script>

<template>
    <input 
        v-if="type === 'text'"
        v-model="value" 
        type="text" 
        :placeholder="placeholder"
        minlength="minlength" 
        maxlength="maxlength" 
        class="font-input-text theme-inputText-bgColor theme-textColor-main inputTypeText allEvents"
    />

    <input 
        v-else-if="type === 'number'"
        v-model="value" 
        type="number"
        :placeholder="placeholder"
        :min="minValue"
        :max="maxValue"
        :step="step"
        class="font-input-text theme-inputText-bgColor theme-textColor-main inputTypeText allEvents"
    />
</template>

<style scoped>

</style>