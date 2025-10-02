<script setup>
import { 
    ArchitectureAppBox as AppBox, 
    ArchitectureOverlayMain as Overlay } 
from '#components';
</script>

<template>
    <AppBox>
        <template #content>
            <NuxtPage />
        </template>

        <template #overlay>
            <Overlay />
        </template>
    </AppBox>
</template>