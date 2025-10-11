<script setup>

const { data: thoughts } = cacheDbGet(
    `key:community:thoughts`,
    `/items/Thoughts`,
    {
        fields: [
    '*',
    'owner.avatar',
    'owner.id' ,
    'owner.displayName',
    'owner.username',
    'date_created',
    'date_lastEvent',
    'date_updated',
    'likes.*'
]
    }
)

</script>

<template v-if="thoughts?.length">
    <NuxtLink
        v-for="item in thoughts" :key="item.id"
        :to="`/users/${item.owner.id}/Thoughts/${item.id}`"
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