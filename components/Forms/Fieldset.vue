<script setup>
const props = defineProps({
    title: {
        type: String,
        required: true
    },
    switch: {
        type: Boolean,
        default: false
    }
});
const switchState = ref(false);
</script>

<template>
    <fieldset>
        <legend>{{ title }}</legend>
        
        <div v-if="switch">
            <FormsSwitch v-model="switchState" />

                <slot  v-if="switchState" />

        </div>

        <div v-else>
            <slot />
        </div>
    </fieldset>
</template>