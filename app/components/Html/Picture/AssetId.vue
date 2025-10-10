<script setup lang="ts">
const appConfig = useAppConfig()

type Source = {
    presetKey?: string,
    mimeType: string
}

const props = defineProps({
    assetId: {
        type: String,
        required: true
    },
    key: String,
    fallbackKey: String
})

</script>

<template>
    <picture>
        <source 
            v-for="(source, index) in sources" 
            :key="index"
            :srcset="parseSourceUrl(source)"
            :type="source.mimeType"
        >

        <img
            :src="fallbackUrl"
            :alt="alt || 'Could not load image'"
            class="block full"
        >
    </picture>
</template>
