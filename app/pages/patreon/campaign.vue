<script setup>
const { data : tiers } = useFetch(
// `/api/patreon/tiers?id=22909817`,
    `/api/patreon/campaign`,
    {
        method: 'GET'
    }
)

const log = computed(() => {
    if(tiers) {
        console.log(tiers)
    }
})

definePageMeta({
    title: 'Patreon campaign',
    description: 'Our Patreon campaign.'
});
</script>

<template>
    <NuxtLayout name="public-route">
        <h1
            class="font-h1"
        >
            Patreon Campaign
        </h1>

        <div 
            v-if="tiers" 
            class="font-text"
        >
        <div class="r">
            {{ tiers.included }}
        </div>
        <div v-for="tier in tiers.included" :key="tier.id" class="r">
            <p v-if="tier.type === 'tier'">
                {{ tier.attributes.title }}

                {{ tier.attributes.description }}

                {{ tier.id }}

            </p>
        </div>
            
        </div>
    </NuxtLayout>
</template>