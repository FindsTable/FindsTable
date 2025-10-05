<script setup>
const route = useRoute()
const userId = route.params.id

// const {
//     response: user,
//     error,
//     isPending,
//     refresh,
//     directFetch
// } = useDirectAsyncFetch(
//     'GET',
//     `/users/${userId}`,
//     {
//         query: {
//             fileds: [
//                 '*',
//                 'personalDataRecord',
//                 'personalDataRecord.firstName.id'
//             ]
//         },
//         differed: true
//     }
// )
// onMounted(() => {
//     refresh()
// })

const { data: user, refresh: refreshUser } = await useAsyncData(
    `user-${userId}`,
    async () => {
        const res = await $fetch(
            `https://admin.findstable.net/users/${userId}`,
            {
                method: 'GET',
                headers: {
                    authorization: `Bearer ${useUserState().value.accessToken.value}`
                },
                query: {
                    fields: '*,personalDataRecord.*.*,badgeRecord.*.*'
                }
            }
        )

        return res.data
    }
)

const { data: badges, refresh: refreshBadges } = await useAsyncData(
    `badges-${userId}`,
    async () => {
        const res = await $fetch(
            `https://admin.findstable.net/items/User_badges`,
            {
                method: 'GET',
                headers: {
                    authorization: `Bearer ${useUserState().value.accessToken.value}`
                },
                query: {
                    fields: '*',
                    filter: {
                        owner: {
                            _eq: userId
                        }
                    }
                }
            }
        )

        return res.data
    }
)

function refresh() {
    refreshUser()
    refreshBadges()
}

</script>

<template>
    <div>
        <button 
            @click.stop.prevent="refresh"
            class="comp-button theme-button -filled"
        >
            refresh
        </button>
    </div>
    <ArchitecturePanelH2Panel v-if="user">
        <template #H2>
            Account
        </template>

        <template #content>
            <p>
                account name: {{ user.username }}
            </p>

            <p>
                username: {{ user.username }}
            </p>

            <p>
                Following : {{ (user.Followings).length }}
            </p>

            <p>
                followers : {{ (user.Followers).length }}
            </p>

        </template>
    </ArchitecturePanelH2Panel>

    <ArchitecturePanelH2Panel v-if="user">
        <template #H2>
            Personnal informations
        </template>

        <template #content>
            <p v-if="user.personalDataRecord[0].email.value">
                email : {{ user.personalDataRecord[0].email.value }}
            </p>

            <p v-if="user.personalDataRecord[0].firstName.value">
                first name : {{ user.personalDataRecord[0].firstName.value }}
            </p>

            <p v-if="user.personalDataRecord[0].lastName.value">
                last name : {{ user.personalDataRecord[0].lastName.value }}
            </p>

            <p v-if="user.personalDataRecord[0].country.value">
                country : {{ user.personalDataRecord[0].country.value }}
            </p>

        </template>
    </ArchitecturePanelH2Panel>

    <ArchitecturePanelH2Panel v-if="user">
        <template #H2>
            Badges
        </template>

        <template #content v-if="user">
            <ContentBadgesBadgeRecord 
                :userId="user.id"
            />
        </template>
    </ArchitecturePanelH2Panel>
</template>