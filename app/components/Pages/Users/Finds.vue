<script setup>

const props = defineProps({
    userId: String
})

const { data: finds } = cacheDbGet(
    `finds:user:${props.userId}`,
    `/items/Finds`,
    {
        fields: '*,images.*,owner.*,owner.avatars.*',
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
        }
    }
)

</script>

<template v-if="feed?.length">
    <NuxtLink
        v-for="item in finds" :key="item.id"
        :to="`/users/${userId}/Finds/${item.id}`"
        class="pointer"
    >
        <ArchitectureAppStructureBoxesMainElement>
            <ContentFindsCardLarge
                :item="item"
                :showUser="true"
                @delete="deleteItem"
            />
        </ArchitectureAppStructureBoxesMainElement>
    </NuxtLink>
</template>