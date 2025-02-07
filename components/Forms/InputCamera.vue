<script setup>
const { t } = useI18n()
const props = defineProps({
    fileType: {
        type: String,
        required: true,
        validator: (value) => ['image', 'document', 'other'].includes(value)
    },
    label: {
        type: String,
        required: false
    },
    capture: {
        type: String,
        default: 'environment'
    },
    accept: {
        type: String,
        default: 'image/*'
    }
})

const emit = defineEmits(['newFile'])

const icons = {
    image: 'addImage',
    document: 'document',
    other: 'file',
}
function handleNewFile(event) {
    const file = event.target.files[0]
    emit('newFile', file)
}
</script>

<template>
    <label class="relative comp-button -text">
        <span class="flex alignCenter gap10">
            <Icon :name="icons[fileType]" />

            <span>{{t(label)}}</span>
        </span>
    <input type="file" @change="handleNewFile" :accept="accept" :capture="capture">
</label>
</template>

<style scoped>
input {
    display: none;
    position: absolute;
    pointer-events: none;
}
</style>