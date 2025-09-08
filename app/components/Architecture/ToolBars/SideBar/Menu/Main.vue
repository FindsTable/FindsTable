<script setup>
const { t } = useI18n()
const { openModal } = useModal()

function handleClick() {
    openModal({
        modal: 'ArchitectureOverlayModalsCreateNewMedia'
    })
}

const links = [
    { textPath: 'sideBarLinks.users', to: '/users', icon: 'users' },
    { textPath: 'sideBarLinks.badges', to: '/success-badges', icon: 'badges' },
    { textPath: 'sideBarLinks.notifications', to: '/notifications', icon: 'notifications' }
]
</script>

<template>
    <div class="flex column gap10">
        <ButtonMain
            @click.prevent="handleClick"
            class="button"
        >
            {{ t("sideBarLinks.create") }}
            <Icon 
                name="create"
                size="22px"       
            />
        </ButtonMain>

        <NuxtLink
            v-for="(link, index) in links" :key="index"
            :to="link.to" 
            class="button"
        >
            {{ t(link.textPath) }}
            <Icon :name="link.icon" size="22px" />
        </NuxtLink>
    </div>
</template>

<style scoped>
.button {
    font-size: 1rem;
    font-weight: 400;
    margin-right: 10px;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    cursor: pointer;
}
</style>