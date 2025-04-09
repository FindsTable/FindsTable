<script setup>
const emit = defineEmits(['deleteFind'])
</script>
<template>
    <div class="relative">
        <div class="toolBar flex justifyEnd">
            <span class="iconTouch" @click.stop.prevent="emit('deleteFind')">
                <Icon class="icon" name="delete" size="24px" />
            </span>
            
            <span class="iconTouch">
                <Icon class="icon" name="edit" size="24px" />
            </span>
            
            <span class="iconTouch">
                <Icon class="icon" name="folderCheck" size="24px" />
            </span>
            
        </div>
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