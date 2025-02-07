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
    <label class="loginLabel relative flex">
        <div class="centered iconLeftBox">
            <slot name="iconLeft">
            
            </slot>
        </div>

        <span 
            v-if="model"
            class="labelText typeFace-main absolute"
        >
            {{ t(label_key) }}
        </span>

        <input 
            class="w100" 
            :type="type" :name="name" 
            :placeholder="t(placeholder_key)"
            :aria-label="t(label_key)" 
            v-model="model"
        >
    </label>
</template>

<style scoped>

label {
    padding: 10px;
    border: 1px solid var(--loginSignup-input-borderColor);
    border-radius: 3px;
}
label:has(input:focus) {
    outline: 1px solid white;
}

.iconLeftBox {
    padding: 0px 0px 0px 6px;
}

input[type="text"],
input[type="password"],
input[type="email"] {
    font-size: 1.1rem;
    font-weight: 500;
    letter-spacing: 0.05em;
    color: var(--theme-textColor-main);
    appearance: none;
    background-color: var(--loginSignup-input-bgColor);
    outline: none;
}
input:focus {
    outline: none;
}

input::placeholder {
    color: var(--loginSignup-input-placeholderColor);
}

:root {
-moz-autofill-background: red;
}
input:autofill {
    -webkit-text-fill-color: var(--textColor-main);
    -moz-autofill-background: var(--textColor-main);
    box-shadow: 0 0 0px 1000px var(--surface1-bgColor) inset;
}
.labelText {
    bottom: 100%;
    left: 14px;
    translate: 0 0.5em;
    color: var(--loginSignup-input-labelColor);
    background-color: var(--surface1-bgColor);
    padding: 0px 6px;
    border-radius: 3px;
}
</style>