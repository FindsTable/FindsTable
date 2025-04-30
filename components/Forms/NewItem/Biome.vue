<script setup lang="ts">
const model = defineModel<string>()

const props = defineProps({
    labelPath: {
        type: String,
        default: ''
    }
})

const { t, locale } = useI18n()

const appContent = useAppContent()

const biomes = computed(() => appContent.value.biomes || [])

function getBiomeName(biome: any) {
    if (!biome) return ''
    if (locale.value === 'fr') return biome.fr || biome.key
    return biome.en || biome.key
}

function toggleBiome(key: string) {
    if (model.value === key) {
        model.value = '' // Deselect
    } else {
        model.value = key // Select
    }
}
</script>

<template>
    <FormsLabel>
        <template #label>
            {{ t(labelPath) }}
        </template>

        <template #input>
            <div class="box flex wrap gap10" v-if="biomes.length">
                <div
                    v-for="b in biomes"
                    :key="b.key"
                    class="biomeCard pointer allEvents"
                    :class="{ selected: model === b.key }"
                    @click="toggleBiome(b.key)"
                >
                    <div class="biomeImage flex">
                        <img 
                            :src="`${useAppConfig().directusUrl}/assets/${b.image}?key=biome-small-jpg`"
                            class="objectFitContain block"
                        />
                    </div>

                    <div class="biomeName">
                        {{ getBiomeName(b) }}
                    </div>
                </div>
            </div>
        </template>
    </FormsLabel>
</template>

<style scoped>
.box {
    padding: 10px 0;
}
.biomeCard {
    background: transparent;
    padding: 3px;
    border-radius: 12px;
    cursor: pointer;
    transition: 200ms;
    overflow: hidden;
}
.biomeCard:hover {
    background: var(--surface2-bgColor);
}
.biomeCard.selected {
    border-color: var(--titleColor-main);
    background-color: var(--color-ft-dark);
    outline: 2px solid var(--color-ft-darker);
    box-shadow: inset 0px 0px 10px rgba(0, 0, 0, 0.766);
}
.biomeImage {
    font-size: 12px;
    margin-bottom: 5px;
}
.hiddenInput {
    position: absolute;
    opacity: 0;
    pointer-events: none;
}
.biomeName {
    font-size: 14px;
    font-weight: 700;
    text-align: center;
}
.biomeImage {
    width: 100px;
    aspect-ratio: 1;
    border-radius: 12px;
    overflow: hidden;
}
</style>
