<script setup lang="ts">
const { t, locale } = useI18n()
const route = useRoute()
const userContent = useUserContent()
const appContent = useAppContent()

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
    'personalDataRecord.lastName.*',
    'thoughts.*'
];

const {
    response : user,
    error,
    isPending,
    differedFetch
} = useDirectAsyncFetch(
    'GET', `/users/${route.params.id}`,
    {
        singleItem: true,
        query: {
            fields: fields.join(','),
            deep: {
                avatars: {
                    _sort: "-currentAt",
                    _limit: 1
                }
            }
        }
    }
)

definePageMeta({
    title: 'User page',
    description: 'The personal page of this user.',
    middleware: 'private-route',
});

const selectedTab = ref("finds")

// collection of full Badges items owned by the user. 
// userContent.bades holds User_badges items
const ownedPublicBadges = computed(() => {

    const userBadges: UserBadge[] = userContent.value.badges
    const publicBadges: FTBadge[] = appContent.value.badges

    const publicBadgesOwnedByUser: FTBadge[] = publicBadges.filter((publicBadge) =>
        userBadges.some((userBadge) => userBadge.badge === publicBadge.key)
    )

    return publicBadgesOwnedByUser
})
// *******

function changeTab(newTab : string) {
    selectedTab.value = newTab
}

const typeSafeUserId = computed(() => {
  const id = route.params.id
  return typeof id === 'string' ? id : ''
})

</script>

<template>
    <NuxtLayout name="private-route" v-if="user">
        <template #header>
            <ArchitectureAppStructureBoxesMainElement>
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
            </ArchitectureAppStructureBoxesMainElement>

            <ArchitectureAppStructureBoxesMainElement>
                <ArchitecturePageTabsFTHAContent
                    :selectedTab="selectedTab"
                    @changeTab="changeTab"
                    class="marTop20"
                />
            </ArchitectureAppStructureBoxesMainElement>
        </template>

        <template #scrollMain>
            <div class="flex column marTop50">
                <KeepAlive>
                    <PagesUsersFinds 
                        v-if="selectedTab === 'finds'"
                        :userId="typeSafeUserId"
                    />
                </KeepAlive>

                <KeepAlive>
                    <PagesUsersThoughts 
                        v-if="selectedTab === 'thoughts'"
                        :userId="typeSafeUserId"
                    />
                </KeepAlive>

                <KeepAlive>
                    <PagesUsersHuntReports 
                        v-if="selectedTab === 'huntReports'"
                        :userId="typeSafeUserId"
                    />
                </KeepAlive>
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