<script setup>
const me = useUserState()

const { 
    notifications, 
    refreshNotifications, 
    markAllAsSeen, 
    markOneAsSeen,
    clearSeen 
} = useNotifications(me.value.id)

function handleMarkAllAsSeen() {
    markAllAsSeen()
}

function handleClearSeen() {
    clearSeen()
}
const seenHidden = ref(false)

function hideSeen() {
    seenHidden.value = !seenHidden.value
}

onMounted(async () => {
    await refreshNotifications()
})

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
            <div class="flex gap10">
                <button 
                    @click="handleMarkAllAsSeen"
                    class="comp-button -filled"
                    :class="[
                        notifications.length == 0 ? 'disabled' : ''
                    ]"
                >
                    Mark All as Seen
                </button>

                <button
                    @click="handleClearSeen"
                    class="comp-button -filled"
                    :class="[
                        notifications.length == 0 ? 'disabled' : ''
                    ]"
                >
                    Clear All Seen
                </button>

                <button
                    @click="hideSeen"
                    class="comp-button -filled"
                    :class="[
                        notifications.length == 0 ? 'disabled' : ''
                    ]"
                >
                    Hide seen
                </button>
            </div>
        </template>

        <template #noScrollMain>

        </template>

        <template #scrollMain>
            <ul>
                <div 
                    v-for="(notif, index) in notifications" :key="index"
                >
                    <ContentNotificationsCardMain
                        v-if="notif.isSeen != true || !seenHidden"
                        :notification="notif"
                        @markOneAsSeen="markOneAsSeen(notif.date_created)"
                    />
                </div>
            </ul>
        </template>
    </NuxtLayout>
</template>