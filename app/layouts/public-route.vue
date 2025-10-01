<script setup>
import {
    PagesIndexBottomBarMain as BottomBar
} from '#components'

</script>

<template>
    <div class="full">
        <ArchitectureAppStructureBoxesMain class="mainBox justifyBetween">
            <ArchitectureFlexGrowVerticalScroll class="">

                <div class="h100 flex column">
                    <slot />

                    <ArchitectureFooter />
                </div>

            </ArchitectureFlexGrowVerticalScroll>

            <BottomBar />
        </ArchitectureAppStructureBoxesMain>
    </div>
</template>

<style scoped>
.mainBox {
    margin: auto;
}
</style>