<script setup>
const props = defineProps({
    imageId: {
        type: String,
    },  
    imageUrl: {
        type: String,
    },
    pointer: {
        type: Boolean,
        default: false
    },
    icon: {
        type: String
    }
})

const src = computed(() => {
    if( props.imageId ) {
        return `/api/assets/${props.imageId}`
    }
    if (props.imageUrl) {
        return props.imageUrl
    }
    return undefined
})

</script>

<template>
    <div 
        :class="{
            'current': imageId === useUserState().value.avatar,
            'pointer': pointer
        }"
        class="avatarFrame centered relative"
    >
        <img
            v-if="imageId || imageUrl"
            :src="src" alt=""
            class="objectFitContain absoluteFull" 
        >
        <div v-else class="slot objectFitContain absoluteFull" >
            <slot name="image">
                
            </slot>
        </div>

        <Icon v-if="icon" :name="icon" size="2.5rem" />

        <div v-else class="slot objectFitContain absoluteFull" >
            <slot name="placeholder">
                
            </slot>
        </div>

        <slot />
    </div>
</template>

<style scoped>
.avatarFrame {
    width: 100px;
    aspect-ratio: 1;
    background-color: var(--trans-white-10);
    border-radius: 10px;
    overflow: hidden;
    isolation: isolate;
}
.current {
    border: 2px solid var(--color-ft);
    box-shadow: 0 0 5px var(--color-ft);
}
img,
.slot {
    z-index: 10;
}
</style>