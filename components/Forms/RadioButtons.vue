<script setup lang="ts">
defineProps<{
    options: { 
        text: string, 
        value: string 
    }[]
}>()
const state = defineModel()

function handleClick(value: string) {
    if(state.value === value) {
        state.value = ''
    } else {
        state.value = value
    }
}
</script>

<template>
    <fieldset>
        <legend>
            <slot name="legend" />
        </legend>

        <label
            v-for="(option, index) in options" :key="index"
            @click.prevent.stop="handleClick(option.value)"
            class="flex alignCenter hiddenInput"
            :class="[ state ? 'true' : 'false' ]"
        >
            <input
                :name="useId()"
                type="radio" 
                :value="option.value"
            />
            <Icon :name="state === option.value ? 'checked' : 'unchecked'" />
            
            <span>
                {{ option.text }}
            </span>            
        </label>
    </fieldset>
</template>