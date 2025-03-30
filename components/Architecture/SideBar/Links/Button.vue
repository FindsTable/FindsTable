<script setup>
const { t } = useI18n() 
const props = defineProps({
    textPath: String,
    icon: String,
    to: String,
});
</script>

<template>
    <NuxtLink :to="to" class="pointer comp-button -filled">
        {{ t(textPath) }}
    </NuxtLink>

    <!-- <div class="btnSlot ">
        <NuxtLink :to="to"  class="btn block pointer">
            {{ t(textPath) }}
        </NuxtLink>
    </div> -->
</template>

<style scoped>
.btnSlot {
    padding: 3px 2px 2px 3px;
    background-color: var(--filledButton-bgColor);
    /* outline: 1px solid rgb(60, 60, 60); */
    border-radius: 10px;
    box-shadow: inset 2px 2px 2px rgba(0, 0, 0, 0.668);
}
.btn {
    font-size: 20px;
    font-weight: bold;
    background-color: var(--filledButton-bgColor);
    padding: 5px 15px;
    border-radius: 8px;
    box-shadow:  0px 0px 5px rgba(0, 0, 0, 0.784), inset 0px 0px 10px rgba(0, 0, 0, 0.568);
}
.btn:hover {
    background-color: rgb(121, 142, 55);
}
.comp-button {
    font-size: 1.3rem;
    font-weight: 700;
    box-shadow: inset 2px 2px 2px rgba(0, 0, 0, 0.74);
}
</style>