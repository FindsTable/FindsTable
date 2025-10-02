<script setup>
const me = useUserState();
const props = defineProps({
    huntReport: Object,
    showUser: {
        type: Boolean,
        default: false
    }
})
const emit = defineEmits(['delete'])
</script>

<template>
    <article 
        v-if="huntReport" 
        class="
            card 
            w100
            flex column gap10 justifyEnd
        "
    >
        <div 
            v-if="showUser"
            class="
                userBox
                flex gap10 alignCenter
                noEvents_kidsEvents
            "
        >
            <NuxtLink 
                :to="`/users/${huntReport.owner.id}`"  
                class="flex gap10"
                
            >
                <img v-if="huntReport.owner.avatar"
                    :src="`https://admin.findstable.net/assets/${huntReport.owner.avatar}?key=avatar-tiny-jpg&v=${Date.now()}`"
                    alt="metalhunter avatar" 
                    class="avatar" 
                />

                <div

                >
                    <p
                        class="username"
                    >
                        {{ huntReport.owner.displayName }}
                    </p>

                    <time class="date fS12 weight3" datetime="2025-03-26">
                        {{ useParseDate(huntReport.date_created) }}
                    </time>
                </div>
            </NuxtLink>
        </div>

        <div
            class=""
        >
            <div
                class="flex justifyBetween"
            >
                <TH3>
                    {{ huntReport.title }}
                </TH3>

                <ContentHuntReportsCardsMenuButton
                    v-if="me.id === huntReport.owner.id"
                    @delete="emit('delete')"
                />
            </div>

            <p class="description">
                {{ huntReport.content }}
            </p>
        </div>
    </article>
</template>

<style scoped>
.imageBox {
    width: 100%;
    display: flex;
    gap: 10px;
}

.avatar {
    height: 100%;
    aspect-ratio: 1;
    border-radius: 50%;
    object-fit: cover;
}

.userBox {
    border-bottom: 1px solid rgba(255, 255, 255, 0.29);
    padding-bottom: 8px;
}
.username {
    font-size: 13px;
    font-weight: 600;
}

.likes {
    flex-shrink: 0;
}
</style>