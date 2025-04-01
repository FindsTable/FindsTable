<script setup>
import {
    PagesUsersBadges
} from '#components'

const $users = useNuxtApp().$users
const route = useRoute()
const me = useUserState()

const fields = [
    '*',
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
const user = ref(null)

async function getUserData() {
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

definePageMeta({
    title: 'User page',
    description: 'The personal page of this user.',
    middleware: 'private-route',
});

const itsMe = computed(() => {
    return me.id === route.params.id
})
const selectedTab = ref("finds")

function changeTab(newTab) {
    selectedTab.value = newTab
}

onMounted( async () => {
    user.value = await getUserData()
})
</script>

<template>
    <NuxtLayout name="private-route" v-if="user">
        <template #header>
            <div class="flex gap10">
                <ArchitectureFramesAvatar :fileId="user.avatar || null" />
                <div>
                    <TH1>
                        {{ user.displayName }}
                    </TH1>

                    <p>
                        {{ user.username }}
                    </p>
                </div>
            </div>

            <ArchitecturePageTabsFTHAContent
                :selectedTab="selectedTab"
                @changeTab="changeTab"
                class="marTop10"
            />
        </template>

        <template #scrollMain>
            <div class="flex column marTop50">
                
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