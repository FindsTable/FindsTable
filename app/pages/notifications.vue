<script setup>
const me = useUserState()

const { 
    notifications, 
    deleteOne,
    deleteAll,
    refreshNotifications, 
} = useNotifications(me.value.id)

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
    <NuxtLayout name="private-route">
        <template #title>
            Notifications
            <span v-if="notifications?.length">({{ notifications.length }})</span>
        </template>

        <template #header>
            <div class="flex gap10">
                <button
                    @click="deleteAll"
                    class="comp-button -filled"
                    :class="[
                        notifications.length == 0 ? 'disabled' : ''
                    ]"
                >
                    Delete All
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
                        @deleteOne="deleteOne(notif.date_created)"
                    />
                </div>
            </ul>
        </template>
    </NuxtLayout>
</template>