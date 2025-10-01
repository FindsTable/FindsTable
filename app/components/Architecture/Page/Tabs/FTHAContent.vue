<script setup>
const props = defineProps({
    selectedTab: {
        type: String,
        default: "finds"
    }
})
const emit = defineEmits(['changeTab'])

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
        value: 'huntReports',
        textPath: 'page.home.tabs.huntReports.tab',
        icon: "book"
    }
]

function changeTab(newTab) {
    emit('changeTab', newTab)
}

</script>

<template>
    <ArchitecturePageTabsMain
        :tabs="pageTabs"
        :selectedTab="selectedTab"
        @changeTab="changeTab"
    />
</template>