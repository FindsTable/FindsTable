<script setup>
const { t, locale } = useI18n()

const props = defineProps({
    notification: {
        type: Object,
        required: true
    }
})
</script>

<template>
    <div class="card flex gap5" v-if="notification">
        <span>
            {{ notification.user_from.username }}
        </span>

        <span>
            {{ notification.action[locale] }}
        </span>

        <span>
            {{ notification.content[locale] }}
        </span>
    </div>
</template>

<style scoped> 
.card {
    padding: 10px 15px;
    border-left: 2px solid rgba(128, 128, 128, 0.514);
    margin-top: 20px;
}
</style>