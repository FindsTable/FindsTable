<script setup>
const { t } = useI18n()
const props = defineProps({
    label: {
        type: String,
        required: true
    },
    capture: {
        type: String,
        required: false
    },
    accept: {
        type: String,
        required: false
    },
    icon: {
        type: String,
        required: false
    }
})

const emit = defineEmits(['newFile'])

function handleNewFile(event) {
    const file = event.target.files[0]
    emit('newFile', file)
}
</script>

<template>
    <label class="relative comp-button -text">
        <span class="flex alignCenter gap10">
            <Icon v-if="icon" :name="icon" />

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