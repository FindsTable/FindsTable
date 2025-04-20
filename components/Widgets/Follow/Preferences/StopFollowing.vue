<script setup lang="ts">
const { t } = useI18n()
const { confirm } = useModal()

// TS style prop declaration !
interface Props {
  user: {
    id: string
    username: string
    avatarUrl: string
  },
    follow: {
        id: String
    }
}
const props = defineProps<Props>()

async function handleClick() {
    const {
      error,
      directFetch
    } = useDirectAsyncFetch(
        'DELETE', `/items/Follows/${props.follow.id}`,
        {
            differed: true,
            onResponse: () => {
                showToaster(true)
            },
            onResponseError: () => {
                showToaster(false)
            }
        }
    )
    await directFetch()

    if(!error.value) {
        confirm()
    }
}

function showToaster( ok : boolean) {
    const message = 
        ok 
        ? `${t('success.activity.follow.stop')} ${props.user.username}` 
        : `There was an error, you are still following ${props.user.username}`;

    useToaster('show', {
        id: `notFollowing-${props.user.id}`,
        message: message,
        type: ok ? 'success' : 'error',
        autoClose: true,
        position: 'bottom'
    })
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