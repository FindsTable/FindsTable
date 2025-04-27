<script setup lang="ts">
const appConfig = useAppConfig()
const biome = defineModel<string | string[]>('biome')
const { t, locale } = useI18n()
type Biome = {
    key: string
    image: string
    translations: {
        id: number
        Biomes_key: string
        Languages_id: {
            id: number,
            code: "en" | "fr"
        }
        value: string | null
        description: string
    }[]
}

const props = withDefaults(defineProps<{
  multiple?: boolean
  textPath: string
}>(), {
  multiple: false
})

const appContent = useAppContent()
const biomes = computed<Biome[]>(() => appContent.value.biomes || [])

function toggleBiome(selectedKey: string) {
    if (props.multiple) {
        if (!Array.isArray(biome.value)) {
            biome.value = []
        }
            const index = biome.value.indexOf(selectedKey)
        if (index !== -1) {
            biome.value = biome.value.filter(key => key !== selectedKey)
        } else {
            biome.value = [...biome.value, selectedKey]
        }
    } else {
        if (biome.value === selectedKey) {
            biome.value = ''
        } else {
            biome.value = selectedKey
        }
    }
}


function isSelected(key: string) {
    if (props.multiple) {
        return Array.isArray(biome.value) && biome.value.includes(key)
    }
    return biome.value === key
}

function getBiomeName(biome: Biome) {
    const translation = biome.translations.find(t => t.Languages_id.code === locale.value)
    return translation?.value || biome.key
}

</script>

<template>
    <TH2 class="sectionTitle">
        {{ t(`${textPath}`) }}
        </TH2>
    <div class="box flex wrap gap10" v-if="appConfig && biomes">
        <div
            v-for="b in biomes" 
            :key="b.key"
            class="biomeCard"
            :class="{ selected: isSelected(b.key) }"
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

<style scoped>
.box {
    padding: 10px 0;
}
.biomeCard {
    background: var(--surface1-bgColor);
    padding: 3px 3px;
    border-radius: 12px;
    
    cursor: pointer;
    transition: 200ms;
    overflow: hidden;
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