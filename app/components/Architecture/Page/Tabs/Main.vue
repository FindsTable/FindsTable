<script setup>
const { t } = useI18n();
const props = defineProps({
    tabs: {
        type: [{
                value: String,
                text: {
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
  return tab?.textPath ? tab.textPath : tab.text
})

function handleClick(tabValue) {

    emit('changeTab', tabValue)
}

</script>

<template>
    <div class="tabContainer gap20">
        <button 
            v-for="tab in tabs" :key="tab.value"
            @click.prevent="handleClick(tab.value)"
            class="comp-button -pageTab theme-buttonText -selectable"
            :class="{ 
                'selected': selectedTab === tab.value
            }"
        >
            <span class="flex gap10 alignCenter">
                <Icon 
                    v-if="tab.icon"
                    :name="tab.icon" size="1.5rem" 
                    class="icon"
                />

                <span
                    v-if="tab.textPath"
                    class="text"
                >
                    {{ t(tab.textPath) }}
                </span>

                <span 
                    v-if="text"
                    class="text"
                >
                    {{ t(tab.text) }}
                </span>
            </span>
        </button>

        <div
            class="selectedTabOnSmallScreen"
        >
            <TH2>
                {{ t(selectedTabForSmallScreen) }}
            </TH2>
        </div>        
    </div>
</template>

<style scoped>
/* .tabContainer {
    border-bottom: 1px solid var(--layout-line-color);
} */

.comp-button.-pageTab {
    font-size: clamp(0.8em, 1.5vw, 1.1em);
    font-weight: 600;
    padding: 0.5em 1em 0.4em 1em;
}

@media (max-width: 858px) {
    .comp-button.-pageTab:has(.icon) span.text {
        display: none;
    }
}

@media (min-width: 859px) {
    .selectedTabOnSmallScreen {
        display: none;
    }
}
</style>