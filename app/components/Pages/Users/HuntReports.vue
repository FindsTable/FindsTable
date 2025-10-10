<script setup>
import { ContentHuntReportsCardsLarge as HuntReportCard } from '#components'
const props = defineProps({
    userId: String
})

const { data: huntReports } = cacheDbGet(
    `huntReports:user:${props.userId}`,
    '/items/Hunt_reports',
    {
        fields: [
            '*',
            'owner.avatar',
            'owner.id',
            'owner.displayName',
            'owner.username'
        ],
        filter: {
            owner: {
                _eq: props.userId
            }
        },
        deep: {
            owner: {
                avatars: {
                    _sort: "-currentAt",
                    _limit: 1
                }
            }
        },
        sort: "-date_created"
    }
)

</script>

<template v-if="huntReports">
    <NuxtLink
        v-for="item in huntReports" :key="item.id"
        :to="`/users/${userId}/Hunt_reports/${item.id}`"
        class="pointer"
    >
        <ArchitectureAppStructureBoxesMainElement
            
        >
            <ContentHuntReportsCardsLarge
                :item="item"
                :showUser="true"
                @delete="deleteItem"
            />
        </ArchitectureAppStructureBoxesMainElement>
    </NuxtLink>
    
</template>