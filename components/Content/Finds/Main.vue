<script setup>
const props = defineProps({
    finds: {
        type: Array
    },
    requestOffset: Number,
    requestLimit: {
        type: Number,
        default: 5
    }
})
const emit = defineEmits(['getNextPage'])
</script>

<template>
    <div 
        v-if="finds"
        class="flex column"
    >
        <template class="flex column">
            <slot name="albumSelector">

            </slot>
        </template>
        
        <div class="flex gap20 wrap marTop20">
            <PagesHomeFindsCard 
                v-for="find in finds" :key="find.id"
                :find="find"
                @click="navigateToItemPage(find)"
            />
        </div>
    </div>

    <div class="centered">
        <button class="comp-button -filled marTop20 font-text -main" @click="emit('getNextPage')">
            next page
        </button>
    </div>
</template>