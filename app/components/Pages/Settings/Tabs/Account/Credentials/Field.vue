<script setup>
import { FormsToggleEditInput } from '#components';

const props = defineProps({
    dataValue: any,
    personalDataObject: any
})

const originalValue = computed(() => {
    if(props.dataValue) {
        return props.dataValue
    }
})
</script>

<template>
    <div>
        <slot>
        
        </slot>
    </div>

    <FormsToggleEditInput 
        type="text"
        :originalValue="dataValue ? dataValue :"
        :id="`username${Date.now()}`"
        fieldName="username"
        :saveChanges="saveNewFieldValue"
        @saveNewFieldValue="saveNewFieldValue"
    />
</template>