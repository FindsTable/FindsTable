<script setup>
const state = defineModel()
const emit = defineEmits(['click'])

function handleClick() {
    state.value = !state.value
    emit('click', state.value)
}

onMounted(() => {
    if(state.value === undefined) {
        console.log('defining default value')
        state.value = false
    }
})
</script>

<template>
    <label
        class="comp-forms-switch flex hiddenInput pointer"
        :class="[ state ? 'true' : 'false' ]"
    >
        <div class="comp-forms-switch-dot"></div>

        <input type="checkbox" v-model="state" @click="handleClick" />
    </label>
</template>

<style scoped>
/*
Colors defined in /css/colors-an-themes/themes/components/uiElements.css
*/
label {
    width: 40px;
    padding: 3px;
    border-width: 2px;
    border-style: solid;
    border-radius: 500px;
    transition: all 0.3s ease;
}


</style>