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
    baseUrl: {
        type: String,
        required: false
    },
    sources: {
        type: Array<Source>,
        required: true
    },
    fallbackUrl: {
        type: String,
        default: '/images/find-no-image.png'
    },
    alt: {
        type: String,
        default: ''
    }
})

function parseSourceUrl(source: Source) {
    const baseUrl = props.baseUrl ? props.baseUrl : `${appConfig.directusUrl}/assets/`
    const key = source.presetKey ? `?key=${source.presetKey}` : ''
    return `${baseUrl}${props.assetId}${key}`
}
</script>

<template>
    <picture
        
    >
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
