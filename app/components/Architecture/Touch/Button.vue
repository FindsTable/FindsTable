<script setup>
const props = defineProps({
    element: {
        type: String,
        required: true
    },
    icon: {
        type: String
    },
    text: {
        type: Boolean,
        default: false
    },
    bStyle: {
        type: String
    }
})
</script>

<template>
    <component :is="element" 
        class="touch flex alignCenter gap10 pointer"
        :class="[bStyle]"
    >
        <div class="content">
            <div v-if="icon" class="iconBox centered">
                <Icon :name="icon"/>
            </div>

            <p v-if="$slots.text" class="textBox r">
                
                <slot name="text">

                </slot>
            </p>
        </div>
    </component>
</template>

<style scoped>
.touch {
    min-height: 48px;
    padding: 3px 6px;
}
.touch:hover {
    background-color: #ffffff10;
}
.touch.filled > .content{
    background-color: #ffffff1e;
}
.touch.text > .content{
    
}
.iconBox {
    padding: 3px;
}
.p {
    font-size: 16px;
}
</style>