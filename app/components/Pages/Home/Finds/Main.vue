<script setup>

const { data: finds } = cacheDbGet(
    `finds:community`,
    `/items/Finds`,
    {
        fields: [
            '*',
            'owner',
            'owner.id',
            'owner.displayName',
            'owner.username',
            'owner.avatar',
            'date_created',
            'date_lastEvent',
            'date_updated',
            'images.*',
            'likes.*',
            'comments.*',
            'bookmarks'
        ]
    }
)
</script>

<template v-if="finds?.length">
    <NuxtLink
        v-for="item in finds" :key="item.id"
        :to="`/users/${item.owner.id}/Finds/${item.id}`"
        class="pointer"
    >
        <ArchitectureAppStructureBoxesMainElement>
            <ContentFindsCardMedium
                :item="item"
                :showUser="true"
                @delete="deleteItem"
                class="medium"
            />

            <ContentFindsCardLarge
                :item="item"
                :showUser="true"
                @delete="deleteItem"
                class="large"
            />
        </ArchitectureAppStructureBoxesMainElement>
    </NuxtLink>
</template>

<style scoped>
@container (min-width: 550px) {
    .medium {
        font-size: 2em;
        display: none;
    }
  
}
@container (max-width: 551px) {
  .large {
    font-size: 2em;
    display: none;
  }
}
</style>