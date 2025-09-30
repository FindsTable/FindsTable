<script setup lang="ts">
const { t, locale } = useI18n()

const tags = defineModel<string[]>()

const props = defineProps({
    textPath: {
        value: String,
        default: ''
    }
})

const appContent = useAppContent()

const availableTags = computed(() => appContent.value.weatherTags || [])

function clickInput(key: string) {
    document.getElementById(key)?.click()
}
</script>

<template>
    <FormsLabel>
        <template #label>
            {{ t(textPath) }}
        </template>

        <template #input>
            <div class="flex wrap gap10 marTop10">
                <div
                    v-for="tag in availableTags"
                    :key="tag.key"
                    class="tag pointer allEvents"
                    @click="clickInput(tag.key)"
                >
                    <input
                        :id="tag.key"
                        type="checkbox"
                        class="hiddenInput"
                        :value="tag.key"
                        v-model="tags"
                    />
                    <div
                        class="comp-button"
                        :class="tags?.includes(tag.key) ? '-filled' : '-text'"
                    >
                        {{ tag[locale] }}
                    </div>
                </div>
            </div>
        </template>
    </FormsLabel>
</template>

<style scoped>
.hiddenInput {
    position: absolute;
    opacity: 0;
    pointer-events: none;
}

.tag {
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.-filled {
    box-shadow: inset 0 0 5px black;
}
</style>
