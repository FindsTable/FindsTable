<script setup>
const state = defineModel()

function handleClick() {
    state.value = !state.value
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
        class="theme-switch flex hiddenInput pointer"
        :class="[ state ? 'true' : 'false' ]"
    >
        <div class="dot"></div>

        <input type="checkbox" v-model="state" />
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
.dot {
    width: 50%;
    aspect-ratio: 1;
    border-radius: 100px;
    transition: all 0.3s ease;
}
label.true .dot {
    translate: 100%;
}

</style>