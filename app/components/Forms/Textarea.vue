<script setup>
const props = defineProps({
    label: {
        type: String,
        default: ''
    },
    placeHolder: {
        type: String,
        default: ''
    }
})
const value = defineModel()
</script>

<template>
    <label class="flex column">
        <span>
            <slot />
        </span>

        <textarea
            :placeholder="placeHolder"
            class="font-textarea"
            v-model="value"
        >

        </textarea>
    </label>
</template>