<script setup>

const props = defineProps({
    processing: Boolean,
    isUnique: Boolean,
})
</script>

<template>
    <div id="eric" class="centered">
        <Icon 
            v-if="processing"
            name="loading"
            size="1.2rem"
            class="icon spinner"
        />
        <Icon
            v-if="!isUnique && !processing"
            name="lockClosed"
            size="1.2rem"
            class="icon lock"
        />
        <Icon
            v-if="isUnique && !processing"
            name="checkCircle"
            size="1.2rem"
            class="icon checkCircle"
        />
    </div>
</template>

<style scoped>
.spinner,
.lock {
    color: rgba(126, 126, 126, 0.53);
}

</style>