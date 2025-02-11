<script setup>
import {
    PagesUsersBadges
} from '#components'

const $users = useNuxtApp().$users
const route = useRoute()

const fields = [
  'id',
  'username',
  'displayName',
  'avatar',
  'currentAvatar.*',
  'badgeRecord.*',
  'badgeRecord.slot1.*',
  'badgeRecord.slot2.*',
  'badgeRecord.slot3.*',
  'patreon_account.tier.*',
  'patreon_account.tier.translations.*',
  'personalDataRecord.*',
  'personalDataRecord.email.*',
  'personalDataRecord.firstName.*',
  'personalDataRecord.lastName.*'
];

const { data : user } = await useAsyncData(
    `user-${route.params.id}`,
    async () => {
        const res = await $users.getById({
            id: route.params.id,
            query: {
                fields: fields.join(','),
                deep: {
                    avatars: {
                        _sort: "-currentAt",
                        _limit: 1
                    }
                }
            }
        })

        return res.data
    }
)
definePageMeta({
    title: 'User page',
    description: 'The personal page of this user.',
    middleware: 'private-route',
});
const id = ref("3f574675-2c38-4a86-a96e-67218695bbb3")
</script>

<template>
    <NuxtLayout name="private-route" v-if="user">
        <template #title>
            {{ user.displayName || user.username }}
        </template>

        <template #header>
            <p v-if="user.displayName">
                {{ user.username }}
            </p>
        </template>

        <template #scrollMain>
            <div class="flex column marTop50">
                <ArchitectureFramesAvatar v-if="user.avatars.length" :fileId="user.avatar" />

                <div class="flex marTop20">
                    <PagesUsersBadges :badgeRecord="user.badgeRecord" />
                </div>

                <p v-if="user.personalDataRecord.email?.public">
                    {{ user.personalDataRecord.email.value }}
                </p>

                <p v-if="user.personalDataRecord.firstName?.public">
                    {{ user.personalDataRecord.firstName.value }}
                </p>

                <p v-if="user.personalDataRecord.lastName?.public">
                    {{ user.personalDataRecord.lastName.value }}
                </p>
            </div>
        </template>
    </NuxtLayout>
</template>

<style scoped>
.r {
    width: 150px;
    height: 150px;
}
</style>