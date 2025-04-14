<script setup>
import { WidgetsFollowPreferencesMain as FollowPreferences } from '#components'
const { t } = useI18n()
const $social = useNuxtApp().$social
const me = useUserState()
const props = defineProps({
    user: {
        id: String,
        username: String,
        avatarUrl: String
    }
})

const { data : follow, refresh } = await useAsyncData(
    `following-${props.user.id}`,
    async () => {

        const res = await useGetItems({
            collection: 'Follows',
            query: {
                filter: {
                    _and: [
                        {
                            follower: {
                                _eq: me.value.id
                            }
                        },
                        {
                            followed: {
                                _eq: props.user.id
                            }
                        }
                    ]
                }
            }
        })

        return res[0]
    }
)

async function handleClick() {
    
    if (follow.value) {
        const { openModal } = useModal()

        await openModal({
            modal: 'ComponentViewer',
            component: FollowPreferences,
            data: {
                user: {
                    id: props.user.id,
                    username: props.user.username,
                    avatarUrl: props.user.avatarUrl
                },
                follow: follow.value
            }
        })
        
        refresh()
        return
    }

    let res = await $social.follow.start(props.user.id)

    if(!res.ok) return 
    const toaster = {
        id: `following-${props.user.id}`,
        message: `${t('success.activity.follow.start')} ${props.user.username}`,
        type: 'success',
        autoClose: true,
        position: 'bottom'
    }
    useToaster('show', toaster)

    refresh()
}

const icons = {
    none: 'friendRequest',
    sent: 'cancelFriendRequest',
    received: 'acceptFriendRequest'
}
const activity =  {
    "social": {
        "follow": {
            "start": "Follow",
            "stop": "Unfollow",
            "following": "Following",
            "followed": "Followed"
        }
    }
}
</script>

<template>
    <button @click.stop.prevent="handleClick"
        class="pointer flex alignCenter gap10 theme-textColor-main comp-button -text"
    >
        <Icon 
            :name="follow ? 'personCheck' : 'personAdd'"
            size="1.3rem"
        />

        <span >
            {{ t(`activity.social.follow.${!follow ? 'start' : 'following'}`) }}
        </span>
    </button>
</template>

<style scoped>

</style>