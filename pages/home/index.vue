<script setup>
definePageMeta({
    title: 'Finds Table',
    description: 'Finds Table, a place to show your share of history.',
    middleware: 'private-route',
});

const me = useUserState()

const route = useRoute()

watch(() => route.query.content, (newVal) => {
    console.log('watching')
    selectedTab.value = newVal
})

const selectedTab = ref(route.query.content)

function changeTab(tabValue) {
    selectedTab.value = tabValue
    navigateTo(`/home?content=${tabValue}`)
}

onMounted(() => {
    selectedTab.value = route.query.content
})
</script>

<template>
    <NuxtLayout name="private-route">
        <template #tabs>
            <ArchitecturePageTabsFTHAContent  :selectedTab="selectedTab" @changeTab="changeTab" />
        </template>

        <template #title>

        </template>

        <template #scrollMain>
            <div 
                v-if="useUserState().value.id"
                class="tabContent"
            >
                <KeepAlive>
                    <PagesHomeThoughtsMain 
                        v-if="selectedTab === 'thoughts'" 
                    />
                </KeepAlive>

                <KeepAlive>
                    <PagesHomeFindsMain 
                        v-if="selectedTab === 'finds'"
                    />
                </KeepAlive>
            </div>
        </template>
    </NuxtLayout>
</template>
