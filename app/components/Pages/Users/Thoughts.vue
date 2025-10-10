<script setup>
import { ContentThoughtsThought } from '#components';
const props = defineProps({
    userId: String
})

const { data: thoughts } = cacheDbGet(
    `huntReports:user:${props.userId}`,
    '/items/Hunt_reports',
    {
        fields: [
            '*',
            'owner.avatar',
            'owner.id',
            'owner.displayName',
            'owner.username',
            'date_created',
            'likes.*'
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

<template v-if="thoughts">
    <NuxtLink
            v-for="item in thoughts" :key="item.id"
            :to="`/users/${userId}/Thoughts/${item.id}`"
            class="pointer"
        >
            <ArchitectureAppStructureBoxesMainElement>
                <ContentThoughtsThought
                    :item="item"
                    :showUser="true"
                    @delete="deleteItem"
                />
            </ArchitectureAppStructureBoxesMainElement>
        </NuxtLink>
</template>