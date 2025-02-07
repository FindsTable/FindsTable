<script setup>
const { t } = useI18n()
const $social = useNuxtApp().$social
const { confirm } = useModal()

const props = defineProps({
    user: {
        id: String,
        username: String,
    },
    follow: {
        id: String
    }
})

async function handleClick() {

    const res = await $social.follow.stop(props.follow.id)
    
    if (!res.ok) return

    const toaster = {
        id: `notFollowing-${props.user.id}`,
        message: `${t('success.activity.follow.stop')} ${props.user.username}`,
        type: 'warning',
        autoClose: true,
        position: 'bottom'
    }

    useToaster('show', toaster)
    confirm()
}

</script>

<template>
    <button @click.stop.prevent="handleClick"
        class="pointer flex alignCenter gap10 theme-textColor-main comp-button -text">
        <Icon name="personCancel" size="1.3rem" />

        <span>{{ t('activity.social.follow.stop') }}</span>
    </button>
</template>

<style scoped></style>