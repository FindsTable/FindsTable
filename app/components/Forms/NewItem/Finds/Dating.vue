<script setup>
const { t, locale } = useI18n();

const dating = defineModel({ 
    type: Object, 
    default: () => ({
        markedYear: null,
        range: { 
            from: null, 
            to: null 
        }
    })
})

function handleClick() {
    // nullify unused values
    if(hasMarkedDate.value) {
        hasMarkedDate.value = false
        dating.value.markedYear = null
    } else {
        hasMarkedDate.value = true
        dating.value.range.from = null
        dating.value.range.to = null
    }
}

const pageTabs = [
    {
        value: "year",
        displayText: "Year",
        textPath: "page.finds.newFind.sections.dating.tabs.preciseYear.tabText",
        icon: "datePrecise"
    },
    {
        value: "range",
        displayText: "Range",
        textPath: "page.finds.newFind.sections.dating.tabs.rangeOfYears.tabText",
        icon: "dateRange"
    }
]
const selectedTab = ref(pageTabs[0].value)
function changeTab(newTab) {
    selectedTab.value = newTab
}
</script>

<template>
    <ArchitecturePageTabsMain
        :tabs="pageTabs"
        :selectedTab="selectedTab"
        @changeTab="changeTab"
        class="marTop10"
    />

    <fieldset  
        v-if="selectedTab === 'year'"
        class="marTop20"
    >
        <FormsLabel class="marTop10">
            <template #input>
                <FormsInput
                    type="number"
                    :placeholder="1977"
                    :min="0"
                    :max="2025"
                    v-model="dating.markedYear"
                />
            </template>
        </FormsLabel>
    </fieldset>

    <fieldset
        v-if="selectedTab === 'range'" 
        class="marTop20"
    >
        <div class="flex gap20">
            <FormsLabel class="marTop10">
                <template #label>
                    {{ t('page.finds.newFind.sections.dating.fields.rangeFrom.label') }}
                </template>

                <template #input>
                    <FormsInput
                        type="number"
                        :placeholder="1899"
                        :min="0"
                        :max="2025"
                        v-model="dating.range.from"
                    />
                </template>
            </FormsLabel>

            <FormsLabel class="marTop10">
                <template #label>
                    {{ t('page.finds.newFind.sections.dating.fields.rangeTo.label') }}
                </template>

                <template #input>
                    <FormsInput
                        type="number"
                        :placeholder="1905"
                        :min="0"
                        :max="2025"
                        v-model="dating.range.to"
                    />
                </template>
            </FormsLabel>
        </div>

    </fieldset>
</template>