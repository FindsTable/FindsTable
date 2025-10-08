<script setup>
const route = useRoute()
const userId = route.params.userId

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

</script>

<template>
    <ArchitectureAppStructureBoxesMainElement>
        <ArchitecturePanelH2Panel v-if="user">
			<template #H2>
				Account
			</template>

			<template #content>
				<p>
					account name: {{ user.username }}
				</p>

				<p>
					username: {{ user.displayName }}
				</p>

				<div class="flex gap20">
					<p>
						Following : {{ (user.Followings).length }}
					</p>

					<p>
						followers : {{ (user.Followers).length }}
					</p>
				</div>

			</template>
		</ArchitecturePanelH2Panel>
    </ArchitectureAppStructureBoxesMainElement>
    
    <ArchitectureAppStructureBoxesMainElement>
        <ArchitecturePanelH2Panel v-if="user?.personalDataRecord[0]">
            <template #H2>
                Personnal informations
            </template>

            <template #content>
                <p v-if="user.personalDataRecord[0].email?.value">
                    email : {{ user.personalDataRecord[0].email.value }}
                </p>

                <p v-if="user.personalDataRecord[0].firstName?.value">
                    first name : {{ user.personalDataRecord[0].firstName.value }}
                </p>

                <p v-if="user.personalDataRecord[0].lastName?.value">
                    last name : {{ user.personalDataRecord[0].lastName.value }}
                </p>

                <p v-if="user.personalDataRecord[0].country?.value">
                    country : {{ user.personalDataRecord[0].country.value }}
                </p>

            </template>
        </ArchitecturePanelH2Panel>
    </ArchitectureAppStructureBoxesMainElement>

    <ArchitectureAppStructureBoxesMainElement>
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
    </ArchitectureAppStructureBoxesMainElement>

    
</template>