<script setup>
const props = defineProps({
    text: String,
    iconName: String
})
</script>

<template>
    <div class="textIconButton pointer">
        <span class="text">
            {{ text }}
        </span>

        <Icon
            :name="iconName"
            class="icon"
        />
    </div>
</template>

<style scoped>
.bottomBar .text{
    display: none;
}
.createIcon {
    width: 22px;
}
</style>