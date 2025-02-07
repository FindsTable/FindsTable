<!-- 
buttons at the top of a form to select the type of form.
ex: login or signup 
-->

<script setup>
const { t } = useI18n();
const props = defineProps({
    types: {
        type: Array
    }
})
const selectedType = defineModel( { default: 'login' } );

function handleClick(type) {
    selectedType.value = type
}
</script>

<template>
    <div class="w100 flex justifyCenter gap20 marTop20">
        <!-- 
        This used to be radio button, but it was getting hydration missmatches.
        Might need to look into it again.
        -->
        <button 
            v-for="type in types" :key="type"
            @click.prevent.stop="handleClick(type)"
            class="
                comp-button
            "
            :class="selectedType === type ? 'comp-button-filled' : 'comp-button -text'"
        >
            {{ t(`forms.buttons.${type}`) }}
        </button>
    </div>
</template>