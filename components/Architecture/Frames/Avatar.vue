<script setup>
const props = defineProps({
    fileUrl: {
        type: String,
    },
    fileId: {
        type: String,
    },
    pointer: {
        type: Boolean,
        default: false
    },
    round: {
        type: Boolean,
        default: false
    },
    width: {
        type: String,
        default: '100px'
    }
})

const src = computed(() => {
    if(props.fileUrl) {
        return props.fileUrl
    }
    if(props.fileId) {
        return `${useAppConfig().directusUrl}/assets/${props.fileId}?key=avatar-small-jpg`
    }
    return undefined
})
</script>

<template>
    <div 
        :class="{
            'current': imageId === useUserState().value.avatar,
            'pointer': pointer,
            'round' : round === true
        }"
        class="avatarFrame centered relative"
        :style="`width: ${width};`"
    >
        <img
            v-if="src"
            :src="src" alt=""
            class="objectFitContain absoluteFull" 
        >
        <div v-else class="slot objectFitContain absoluteFull" >
            <slot name="image">
                
            </slot>
        </div>

        <Icon name="account" />
    </div>
</template>

<style scoped>
.avatarFrame {
    aspect-ratio: 1;
    background-color: var(--trans-white-10);
    border-radius: 10px;
    overflow: hidden;
    isolation: isolate;
}
.avatarFrame.round {
    border-radius: 1000px;
}
img,
.slot {
    z-index: 10;
}

</style>