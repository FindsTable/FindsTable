<script setup>
const props = defineProps({
    selected: Boolean,
    to: String
})
</script>
<template>
    <NuxtLink 
            :to="to"
            class="
                flowButton grow pointer comp-button -shaped flex alignCenter"
            :class="selected ? 'selected' : ''"
        >
        
        <slot name="text">

        </slot>

        <slot name="icon">

        </slot>
    </NuxtLink>
</template>

<style scoped>
.sideBar .flowButton {
    height: 48px;
}
.mobileTopBar .flowButton {
    height: auto;
    font-size: 10px;
}
.sideBar .flowButton {
    justify-content:flex-end;
    gap: 5px;
}
.mobileTopBar .flowButton {
    justify-content: center;
    gap: 10px;
}
</style>