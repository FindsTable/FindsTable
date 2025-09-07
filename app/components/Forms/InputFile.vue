<!-- 
    DEPRECATED

    SHOULD BE REPLACED BY FormsFilePicker.vue
-->

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

/*********************************************************
// this is used to allow the click on the 
// image container to open the selection window
*/
const inputRef = ref(null)

defineExpose({
  openFileDialog
})

function openFileDialog() {
    inputRef.value?.click()
}
/*
***********************************************************/

function handleNewFile(event) {
    const file = event.target.files[0]
    emit('newFile', file)
}

</script>

<template>
    <label class="relative comp-button -text" ref="inputRef">
        <span class="flex alignCenter gap10">
            <Icon v-if="icon" :name="icon" size="20px" />

            <span class="text">
                {{t(label)}}
            </span>
        </span>
    <input 
        type="file" 
        @change="handleNewFile" 
        :accept="accept" 
        :capture="capture"
    >
</label>
</template>

<style scoped>
input {
    display: none;
    position: absolute;
    pointer-events: none;
}
.text {
    font-size: 12px;
}
</style>