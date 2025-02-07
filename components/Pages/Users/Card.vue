<script setup>
import { ArchitectureFramesPatreonAvatar as PatreonFrame } from '#components'
import { ArchitectureFramesAvatar as AvFrame } from '#components'
import { PagesUsersBadges } from '#components'

const props = defineProps({
    user: {
        type: Object,
        required: true
    }
})

function parseAvatarSrc(avatarObj) {
    if (avatarObj) {
        return `/api/assets/${avatarObj.image}`
    }
    return undefined
}

</script>

<template>
    <div class="container flex">
        <NuxtLink :to="`/users/${user.id}`" class="card flex column alignStart gap20 pointer">
            <div class="flex gap20">
                <div>
                    <PatreonFrame 
                        :patreonAccount="user.patreon_account[0]"
                    >
                        <template #avatar>
                            <AvFrame :fileUrl="parseAvatarSrc(user.avatars[0])" />
                        </template>
                    </PatreonFrame>

                </div>

                <div class="flex column justifyEnd">
                    <div class="card-header">
                        <h3>{{ user.username }}</h3>
                    </div>

                    <div class="flex marTop20">
                        <WidgetsFollowButton :user="{
                                id: user.id,
                                username: user.username,
                                avatarUrl: parseAvatarSrc(user.avatars[0])
                            }" />
                    </div>
                </div>
            </div>

            <div class="badges">
                <PagesUsersBadges :badgeRecord="user.badgeRecord" />
            </div>

            <div class="">
                <PagesUsersFollows :userId="user.id" />
            </div>
        </NuxtLink>
    </div>
</template>

<style scoped>
.mouseFeedback:hover {
    background-color: #ffffff1e;
}
.box {
    padding: 5px;
}
.container {
    border-radius: 6px;
    overflow: hidden;
    gap: 5px;
}
.card {
    flex-grow: 1;
    background-color: #ffffff24;
    padding: 15px;
    user-select: none;
}
</style>