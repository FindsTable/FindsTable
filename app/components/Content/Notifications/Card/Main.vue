<script setup>
const { t, locale } = useI18n()

const props = defineProps({
    notification: {
        type: Object,
        required: true
    }
})
const emit = defineEmits(['markOneAsSeen', 'deleteOne'])

</script>

<template>
    <li 
        v-if="notification"
        class="card flex alignCenter gap20 font-text -big"
        :class="[
                notification.isSeen ? 'dimmed':  ''
        ]"
    >

        <NuxtLink 
            v-if="notification.user_from?.avatar"
            :to="`/users/${notification.user_from.id}`"
            class="pointer"
        >
            <ArchitectureFramesAvatar 
                :fileId="notification.user_from.avatar"
                width="40px"
            />
        </NuxtLink>

        <div class="flex gap5">
            <NuxtLink 
                v-if="notification.user_from?.avatar"
                :to="`/users/${notification.user_from.id}`"
                class="pointer"
            >
                <span>
                    {{ notification.user_from.displayName }}
                </span>
            </NuxtLink>
            

            <span>
                {{ t(`notifications.actions.${notification.action}`) }}
            </span>

            <span v-if="notification.content">
                {{ t(`notifications.content.${notification.content}`) }}
            </span>
        </div>

        <div class="flex gap10">
            <NuxtLink 
                v-if="notification.item?.toPath"
                :to="notification.item.toPath"
                class="pointer"
            >
                <ArchitectureFramesAvatar 
                    v-if="notification.item?.thumbnail"
                    @click="console.log(notification)"
                    :fileId="notification.item.thumbnail"
                    width="40px"
                />
            </NuxtLink>

            <span 
                @click.stop.prevent="emit('deleteOne')"
                class="comp-button centered pointer"
            >
                <Icon name="delete" size="24px" />
            </span>
        </div>
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