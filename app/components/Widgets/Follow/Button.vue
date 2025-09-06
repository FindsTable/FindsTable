<script setup lang="ts">
import { WidgetsFollowPreferencesMain as FollowPreferences } from '#components'

const { t } = useI18n()
const me = useUserState()

// is used only in TS
interface Props {
  user: {
    id: string
    username: string
    avatarUrl: string
  }
}
const props = defineProps<Props>()

// BUT if used outside of TS, we need to use this declaration instead

// const props = defineProps({
//   user: {
//     type: Object as PropType<{
//       id: string
//       username: string
//       avatarUrl: string
//     }>,
//     required: true
//   }
// })

const {
    response : follow,
    isPending,
} = useDirectAsyncFetch<object>(
    'GET', '/items/Follows',
    {
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
        },
        singleItem: true
    }
)

async function handleClick() {

    if(isPending.value ) return
    
    if (follow.value) {
        const { openModal } = useModal()

        const modalConfirmed = await openModal({
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
        if(modalConfirmed) {
            follow.value = null
        }

        return
    }

    const {
      response
    } = useDirectAsyncFetch<object>(
        'POST', '/items/Follows',
        {
            body: {
                followed: props.user.id
            },
            onResponse: () => {
                follow.value = response.value
                useToaster('show', {
                    id: `following-${props.user.id}`, // same id as onRensponseError to have it only once
                    message: `${t('success.activity.follow.start')} ${props.user.username}`,
                    type: 'success',
                    autoClose: true,
                    position: 'bottom'
                }) 
            },
            onResponseError: () => {
                follow.value = null
                useToaster('show', {
                    id: `following-${props.user.id}`, // same id as onResponse to have it only once
                    message: `Oh wait ! an error occured and you don't follow ${props.user.username} yet !`,
                    type: 'error',
                    autoClose: true,
                    position: 'bottom'
                })
            }
        }
    )
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