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
    'GET', `/users/${route.params.userId}`,
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

const selectedContentTab = ref("finds")

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

function changeContentTab(newTab : string) {
    selectedContentTab.value = newTab
}

const typeSafeUserId = computed(() => {
  const id = route.params.userId
  return typeof id === 'string' ? id : ''
})

const selectedPageTab = ref('content')

function changePageTab(tab : string) {

    selectedPageTab.value = tab
}
const userTabs = [
    {
        value: 'content',
        textPath: 'Content',
        icon: 'content'
    },
    {
        value: 'profile',
        textPath: 'Profile',
        icon: 'account'
    }
]
</script>

<template>
    <NuxtLayout name="private-route" v-if="user">
        <template #header>
            <ArchitectureAppStructureBoxesMainElement
                class="hiddenHeader"
            >
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

            <ArchitectureAppStructureBoxesMainElement
                class="vidibleHeader"
            >
                <div class="tabBar flex gap10">
                    <ArchitecturePageTabsLightWeight
                        :tabs="userTabs"
                        :selectedTab="selectedPageTab"
                        @changeTab="changePageTab"
                    />
                </div>
            </ArchitectureAppStructureBoxesMainElement>
            
            <ArchitectureAppStructureBoxesMainElement
                v-if="selectedPageTab === 'content'"
            >
                <ArchitecturePageTabsFTHAContent
                    :selectedTab="selectedContentTab"
                    @changeTab="changeContentTab"
                    class="marTop20"
                />
            </ArchitectureAppStructureBoxesMainElement>
        </template>

        <template #scrollMain>
            <div 
                v-if="selectedPageTab === 'content'"
                class="flex column marTop50"
            >
                <KeepAlive>
                    <PagesUsersFinds 
                        v-if="selectedContentTab === 'finds'"
                        :userId="typeSafeUserId"
                    />
                </KeepAlive>

                <KeepAlive>
                    <PagesUsersThoughts 
                        v-if="selectedContentTab === 'thoughts'"
                        :userId="typeSafeUserId"
                    />
                </KeepAlive>

                <KeepAlive>
                    <PagesUsersHuntReports 
                        v-if="selectedContentTab === 'huntReports'"
                        :userId="typeSafeUserId"
                    />
                </KeepAlive>
            </div>

            <ArchitectureAppStructureBoxesMainElement>
                <PagesUsersProfile
                    v-if="selectedPageTab === 'profile'"
                />
            </ArchitectureAppStructureBoxesMainElement>
        </template>
    </NuxtLayout>
</template>

<style scoped>

</style>