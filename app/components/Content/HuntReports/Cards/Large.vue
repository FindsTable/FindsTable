<script setup>
const me = useUserState();
const props = defineProps({
    item: Object,
    showUser: {
        type: Boolean,
        default: false
    }
})
const emit = defineEmits(['delete'])
</script>

<template>
    <article 
        v-if="item" 
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
                :to="`/users/${item.owner.id}`"  
                class="flex gap10"
                
            >
                <img v-if="item.owner.avatar"
                    :src="`https://admin.findstable.net/assets/${item.owner.avatar}?key=avatar-tiny-jpg&v=${Date.now()}`"
                    alt="metalhunter avatar" 
                    class="avatar" 
                />

                <div

                >
                    <p
                        class="username"
                    >
                        {{ item.owner.displayName }}
                    </p>

                    <time class="date fS12 weight3" datetime="2025-03-26">
                        {{ useParseDate(item.date_created) }}
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
                    {{ item.title }}
                </TH3>

                <ContentHuntReportsCardsMenuButton
                    v-if="me.id === item.owner.id"
                    @delete="emit('delete', item.id)"
                />
            </div>

            <p class="description">
                {{ item.content }}
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