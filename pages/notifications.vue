<script setup>
const me = useUserState()
const { 
    notifications, 
    refreshNotifications, 
    markAsSeen, 
    clearSeen 
} = useNotifications(me.value.id)

onMounted(async () => {
    await refreshNotifications()
})

function handleMarkAllAsSeen() {
    markAsSeen()
}

function handleClearSeen() {
    clearSeen()
}

definePageMeta({
    title: 'Notification',
    description: 'Keep track of what is going on around the fids table !',
    middleware: 'private-route',
});
</script>

<template>
    <TH1>
        Notifications
    </TH1>

    <NuxtLayout name="private-route">
        <template #title>
            Notifications 
            <span v-if="notifications?.length">({{ notifications.length }})</span>
        </template>

        <template #header>

        </template>

        <template #noScrollMain>

        </template>

        <template #scrollMain>
            <ul>
                <li v-for="(notif, index) in notifications" :key="index">
                    <strong>{{ notif.type }}</strong>
                    <span> by user <b>{{ notif.actorId }}</b></span>
                    <span v-if="notif.targetId"> on item {{ notif.targetId }}</span>
                    <p>
                        Date: {{ notif.createdAt }} |
                        Seen? <b>{{ notif.isSeen }}</b>
                    </p>
                </li>
            </ul>

            <button @click="handleMarkAllAsSeen">
                Mark All as Seen
            </button>
            <button @click="handleClearSeen">
                Clear All Seen
            </button>
        </template>
    </NuxtLayout>
</template>