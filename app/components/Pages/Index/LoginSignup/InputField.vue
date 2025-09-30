<script setup>
const { t } = useI18n();
const model = defineModel()

defineProps({
    id: {
        type: String,
        required: false,
    },
    type: {
        type: String,
        default: 'text',
        required: false,
    },
    name: {
        type: String,
        required: true,
    },
    label_key: {
        type: String,
        required: true,
    },
    placeholder_key: {
        type: String,
        required: true,
    },
    showLabel: {
        type: Boolean,
        default: false,
    }
})
</script>

<template>
    <label class="loginLabel relative flex cutoutContainer theme-cutoutEffect">
        <span 
            v-if="model"
            class="labelText typeFace-main"
        >    
            {{ t(label_key) }}s
        </span>

        <div class="overflowHidden grow flex">
            <div class="centered iconLeftBox">
                <slot name="iconLeft">
                
                </slot>
            </div>

            <input 
                class="w100 " 
                :type="type" :name="name" 
                :placeholder="t(placeholder_key)"
                :aria-label="t(label_key)" 
                v-model="model"
            >
        </div>
    </label>
</template>

<style scoped>

label .overflowHidden{
    border-radius: 3px;
}

input[type="text"],
input[type="password"],
input[type="email"] {
    font-size: 1.1rem;
    font-weight: 500;
    letter-spacing: 0.05em;
    appearance: none;
    background-color: transparent;
    padding: 10px;
}

input::placeholder {
    color: var(--surface1-cutout-placeholderColor);
}

.labelText {
    position: absolute;
    bottom: 100%;
    left: 14px;
    translate: 0 0.5em;

    font-size: 0.7rem;
    color: var(--surface1-cutout-textColor);
    background-color: var(--backdropColor);
    padding: 2px 6px;
    border-radius: 3px;
}
</style>