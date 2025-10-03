<script setup>
const emit = defineEmits(['deleteFind'])

</script>

<template>
    <div class="toolBar flex justifyEnd noEvents_kidsEvents">
        <span 
            @click.stop.prevent="emit('deleteFind')"
            class="iconTouch"
        >
            <Icon class="icon" name="delete" size="24px" />
        </span>
    </div>
</template>

<style scoped>
.iconTouch {
    width: 36px;
}
.icon {
    color: rgb(159, 156, 156);
}
.icon:hover {
    color: var(--textColor-main);
}
</style>