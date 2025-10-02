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
    <div class="tabContainer gap20">
        <ArchitectureAppStructureBoxesMainElement>
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

                    <span class="text">
                        {{ t(tab.textPath) }}
                    </span>
                </span>
            </button>
        </ArchitectureAppStructureBoxesMainElement>

        <ArchitectureAppStructureBoxesMainElement
            class="selectedTabOnSmallScreen"
        >
            <TH2>
                {{ t(selectedTabForSmallScreen) }}
            </TH2>
        </ArchitectureAppStructureBoxesMainElement>        
    </div>
</template>

<style scoped>
.tabContainer {
    border-bottom: 1px solid var(--layout-line-color);
}

@media (min-width: 859px) {
    .selectedTabOnSmallScreen {
        display: none;
    }
}
</style>