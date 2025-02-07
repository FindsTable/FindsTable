<script setup>

const title = ref('')
</script>

<template>
    <ArchitecturePanelMain>
        <TH2>
            Tell us about your find
        </TH2>
        
        <form class="flex column gap20 marTop20">
            <PagesFindsNewFormTitle
                v-model="title"
            />

            <PagesFindsNewFormDating />
        </form>
    </ArchitecturePanelMain>
</template>