<script setup>
const { t } = useI18n()
const toasters = useToasters()
const props = defineProps({
    toast: {
        type: Object,
        required: true
    }
})
</script>

<template>
    <div class="frame centered" v-if="toasters[toast.id]">
        <div class="toast" :class="[ props.toast.type ]">
            <p class="message font-text -big" v-if="toast.message">
                {{ toast.message }}
            </p>

            <p class="message font-text -big" v-if=toast.messagePath>
                {{ t(toast.messagePath) }}
            </p>
        </div>
    </div>
</template>

<style scoped>
.frame {
    width: 100%;
    height: 0;
    animation: in 300ms ease forwards;
}
@keyframes in {
    from {
        height: 0;
    } 
    to {
        height: 75px;
    }
}

.toast {
    width: min(auto, 100%);
    color: white;
    font-size: 1rem;
    font-weight: 400;
    padding: min(0.6em, 10px) min(1.2em, 15px);

    margin: 12px; /*shoudl be the safe area inset*/

    border-radius: 4px;
    box-shadow: 0px 0px 100px rgba(0, 0, 0, 0.15);

    transition: 300ms ease;
}

.toast.success {
    background-color: var(--color-success);
}
.toast.error {
    background-color: var(--color-error);
}
.toast.warning {
    background-color: var(--color-warning);
}
.toast.info {
    background-color: var(--color-info);
}
</style>