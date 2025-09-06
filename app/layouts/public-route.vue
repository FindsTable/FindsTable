<script setup>
import {
    PagesIndexBottomBarMain as BottomBar,
    ArchitectureContentWidth as ContentWidth
} from '#components'

</script>

<template>
    <main class="full flex column justifyEnd">
        <ArchitectureFlexGrowScrollableChild 
            childClass="centered"
        >
            <ContentWidth small class="h100 flex column gap20">

                <slot />

                <ArchitectureFooter />
            </ContentWidth>
        </ArchitectureFlexGrowScrollableChild>

        <BottomBar />
    </main>
</template>