<script setup>
const { t } = useI18n();
const props = defineProps({
    tabs: {
        type: [{
                value: String,
                displayText: {
                    type: String,
                    required: false
                },
                textPath: String,
                icon: String
            }
        ],
        required: true
    },
    selectedTab: {
        type: String,
        required: false
    }
})

const emit = defineEmits(['changeTab'])

const selectedTabForSmallScreen = computed(() => {
  const tab = props.tabs.find(tab => tab.value === props.selectedTab)
  return tab?.textPath
})

function handleClick(tabValue) {

    emit('changeTab', tabValue)
}

</script>

<template>
    <div class="tabContainer gap20 w100">
        <button 
            v-for="tab in tabs" :key="tab.value"
            @click.prevent="handleClick(tab.value)"
            class="tab theme-buttonText pointer"
            :class="{ 
                'selected': selectedTab === tab.value
            }"
        >
            <span class="flex gap10 alignCenter">
                <span class="text">
                    {{ t(tab.textPath) }}
                </span>
            </span>
        </button>      
    </div>
</template>

<style scoped>
.tabContainer {
    border-bottom: 1px solid var(--layout-line-color);
}
.tab {
    padding: 5px 20px;
}
.tab.selected {
    border-bottom: 4px solid var(--layout-line-color);
}

@media (max-width: 858px) {
    .tab:has(.icon) span.text {
        display: none;
    }
}

@media (min-width: 859px) {
    .selectedTabOnSmallScreen {
        display: none;
    }
}
</style>