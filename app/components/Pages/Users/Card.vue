<script setup>
import { ArchitectureFramesAvatar as AvFrame } from '#components'

const props = defineProps({
    user: {
        type: Object,
        required: true
    }
})

</script>

<template>
    <div class="container flex" v-if="user">
        <NuxtLink :to="`/users/${user.id}`" class="card theme-surface1 -hoverable flex column alignStart gap20 pointer">
            <div class="flex gap20">
                <div class="">
                    <AvFrame :fileId="user.avatar" />
                </div>

                <div class="flex column justifyEnd">
                    <div class="card-header">
                        <h3>{{ user.displayName }}</h3>
                        <h3 class="
                                font-text -small
                                theme-textColor-dimmed">
                            {{ user.username }}
                        </h3>
                    </div>

                    <div class="flex marTop20">
                        <WidgetsFollowButton :user="{
                            id: user.id,
                            username: user.username,
                            avatarUrl: `${useAppConfig().directusUrl}/assets/${user.avatar}`
                        }" />
                    </div>
                </div>
            </div>

            <div class="badges">
                <ContentBadgesBadgeRecordPublic
                    :userId="user.id"
                />
            </div>

            <div class="">
                <PagesUsersFollows :userId="user.id" />
            </div>
        </NuxtLink>
    </div>
</template>

<style scoped>
.container {
    border-radius: 6px;
    overflow: hidden;
    gap: 5px;
}
.card {
    flex-grow: 1;
    padding: 15px;
    user-select: none;
}
.badges {
    height: 100px;
}
</style>