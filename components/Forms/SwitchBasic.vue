<!-- 
    This switch simply reflects the state
    passed by the parent
-->

<script setup>
const props = defineProps({
    state: Boolean
})
</script>

<template>
    <div
        class="comp-forms-switch flex hiddenInput pointer"
        :class="[ state ? 'true' : 'false' ]"
    >
        <div class="comp-forms-switch-dot"></div>
    </div>
</template>