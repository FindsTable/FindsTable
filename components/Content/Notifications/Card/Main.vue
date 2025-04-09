<script setup>
const { t, locale } = useI18n()

const props = defineProps({
    notification: {
        type: Object,
        required: true
    }
})
const emit = defineEmits(['markOneAsSeen'])

</script>

<template>
    <li 
        v-if="notification"
        class="card flex alignCenter gap5 font-text -big"
        :class="[
                notification.isSeen ? 'dimmed':  ''
        ]"
    >
        <span>
            {{ notification.user_from.displayName }}
        </span>

        <span>
            {{ t(`notifications.actions.${notification.action}`) }}
        </span>

        <span v-if="notification.content">
            {{ t(`notifications.content.${notification.content}`) }}
        </span>

        <span 
            @click.stop.prevent="emit('markOneAsSeen')"
            class="markAsReadTouch centered pointer"
        >
            <Icon name="checkCircle" size="24px" />
        </span>
    </li>
</template>

<style scoped>
 
.card {
    padding: 10px 15px;
    border-left: 2px solid rgba(128, 128, 128, 0.514);
    margin-top: 20px;
}
.card:hover {
    box-shadow: inset 0 0 5px rgba(128, 128, 128, 0.326);
}
.card.dimmed {
    filter: brightness(0.4);
}
.markAsReadTouch {
    width: 32px;
    aspect-ratio: 1;
    border-radius: 50%;
    background-color: rgba(128, 128, 128, 0.467);
}
</style>