<script setup>
import { 
    ArchitecturePageTitlesH1 as h1Title,
    ArchitecturePageTabsMain as Tabs,
    PagesSettingsTabsAccountMain as Account,
    PagesSettingsTabsAppMain as App,
    PagesSettingsTabsPatreonMain as Patreon,
} from '#components'


const { t } = useI18n();



function changeTab(tab) {
    selectedTab.value = tab
}

const pageTabs = [
    {
        value: 'app',
        textPath: 'page.settings.tabs.app.tab',
        icon: 'tabler:device-desktop-cog'
    },
    {
        value: 'account',
        textPath: 'page.settings.tabs.account.tab',
        icon: 'manageAccount'
    },
    {
        value: 'patreon',
        textPath: 'page.settings.tabs.patreon.tab',
        icon: undefined
    }
]
const selectedTab = ref(pageTabs[0].value)

definePageMeta({
    title: 'Account',
    description: 'Finds Table, a place to show your share of history.',
    middleware: 'private-route',
});

</script>

<template>
    <NuxtLayout name="private-route">
        <template #title>
            {{ t('page.settings.title') }}
        </template>

        <template #noScrollMain>
            <Tabs :tabs="pageTabs" :selectedTab="selectedTab" @changeTab="changeTab" />
        </template>
        
        <template #scrollMain>
            <Account v-if="selectedTab === 'account'" />
            <App v-if="selectedTab === 'app'"/>
            <Patreon v-if="selectedTab === 'patreon'" />
        </template>
    </NuxtLayout>
</template>

<style scoped>

</style>