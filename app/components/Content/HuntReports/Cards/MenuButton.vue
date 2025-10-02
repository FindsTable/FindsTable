<script setup>
const emit = defineEmits(['delete'])
</script>

<template>
    <div class="menu flex justifyEnd">
        <div 
            @click.stop.prevent="emit('delete')"
            class="iconTouch pointer centered"
        >
            <Icon class="icon noEvents" name="delete" size="24px" />
        </div>
    </div>
    
</template>

<style scoped>
.iconTouch {
    padding: 3px;
    border-radius: 5px;
    aspect-ratio: 1;
}
.icon {
    color: rgb(159, 156, 156);
}
.icon:hover {
    color: var(--textColor-main);
}
</style>