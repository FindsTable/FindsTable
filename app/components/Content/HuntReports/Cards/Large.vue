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
    <ArchitecturePanelMain 
        v-if="item" 
        class="
            card 
            w100
            flex column gap10 justifyEnd
        "
    >
        <ContentItemsTopBarUser
            v-if="item?.owner?.id"
            :userId="item.owner.id"
            :date="useParseDate(item.date_created)"
        />

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
    </ArchitecturePanelMain>
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