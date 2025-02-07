<script setup>
const { t } = useI18n();
const props = defineProps({
    tabs: {
        type: [{
                value: String,
                textPath: String,
                icon: String
            }
        ],
        required: true
    },
    selectedTab: {
        type: String,
        required: true
    }
})
const emit = defineEmits(['changeTab'])

function handleClick(tabValue) {
    emit('changeTab', tabValue)
}
</script>

<template>
    <div class="flex gap20">
        <button 
            v-for="tab in tabs" :key="tab.value"
            @click="handleClick(tab.value)"
            class="comp-button -pageTab"
            :class="{ '-selected': selectedTab === tab.value }"
        >
            <span class=" flex gap10 alignCenter">
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
    </div>
</template>

<style scoped>


</style>