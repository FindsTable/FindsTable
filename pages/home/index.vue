<script setup>
import {
    PagesHomeThoughtsMain,
    ArchitecturePageTabsMain as Tabs
} from '#components'

definePageMeta({
    title: 'Finds Table',
    description: 'Finds Table, a place to show your share of history.',
    middleware: 'private-route',
});

const { t, locale } = useI18n();
const $items = useNuxtApp().$items
const user = useUserState()

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

const pageTabs = [
    {
        value: 'finds',
        textPath: 'page.home.tabs.finds.tab',
        icon: 'content'
    },
    {
        value: 'thoughts',
        textPath: 'page.home.tabs.thoughts.tab',
        icon: 'chat'
    },
    {
        value: 'reports',
        textPath: 'page.home.tabs.huntReports.tab',
        icon: "book"
    },
    {
        value: 'articles',
        textPath: 'page.home.tabs.articles.tab',
        icon: "article"
    }
]
onMounted(() => {
    selectedTab.value = route.query.content
})
</script>

<template>
    <NuxtLayout name="private-route">
        <template #tabs>
            <Tabs :tabs="pageTabs" :selectedTab="selectedTab" @changeTab="changeTab" />
        </template>

        <template #title>

        </template>

        <template #scrollMain>
            <div class="tabContent">
                <KeepAlive>
                    <PagesHomeThoughtsMain v-if="selectedTab === 'thoughts'" />
                </KeepAlive>

                <KeepAlive>
                    <PagesHomeFindsMain v-if="selectedTab === 'finds'" />
                </KeepAlive>
            </div>
        </template>
    </NuxtLayout>
</template>
