<template>
    <div class="flex justifyCenter gap20 marTop50">
        <button @click="$emit('cancel')" class="comp-button -filled -cancel">
            cancel
        </button>

        <button @click="$emit('confirm')" class="comp-button -filled -confirm">
            confirm
        </button>
    </div>
</template>

<style scoped>

</style>