<script setup>
import { ArchitectureOverlayToastersToast as Toast } from '#components';
const toasters = useToasters()

const props = defineProps({
    position: {
        type: String,
        required: false
    },
    id: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: false
    }
})
const tempToasters = {
    top: {
        position: 'top',
        toasts: []
    },
    bottom: {
        position: 'bottom',
        toasts: []
    }
}

const parsedToasters = computed(() => {
    const toasterIds = Object.keys(toasters.value)

    if(!toasterIds.length ) return [ tempToasters.top, tempToasters.bottom]

    
    for(let id of toasterIds) {
        tempToasters[toasters.value[id].position].toasts.push(toasters.value[id])
        toasters.value[id].showing = true
    }

    const returnValue = [ {
        ...tempToasters.top,
        toasts: {
            ...tempToasters.top.toasts
        }
    }, {
        ...tempToasters.bottom,
        toasts: {
            ...tempToasters.bottom.toasts
        }
    }]

    tempToasters.top.toasts = []
    tempToasters.bottom.toasts = []

    return returnValue
})

</script>

<template>
    <div class="absoluteFull flex column alignCenter">
        <div
            v-for="toaster in parsedToasters" :key="toaster.position"
            class="toaster flex column alignCenter"
            :class="toaster.position"
        >

            <Toast 
                v-for="toast in toaster.toasts" :key="toast.id"
                :toast="toast"
            />
        </div>
    </div>
</template>

<style scoped>
.absoluteFull {
    pointer-events: none;
    padding: 30px 5px;
}
.toaster {
    width: min(100%, 400px);
    height: 50%;
}
.toaster.top {
    flex-direction: column;
}
.toaster.bottom {
    flex-direction: column;
    justify-content: flex-end;
}

</style>