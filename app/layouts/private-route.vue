<script setup>

</script>

<template>
    <div 
        v-if="useUserState().value.isLoggedIn"
        class="full flex column justifyEnd isolate"
    >
        <div 
            class="grow flex w100 relative"
        >
            <ArchitectureAppStructureBoxesLeft>
                <ArchitectureToolBarsSideBarMain />
            </ArchitectureAppStructureBoxesLeft>

            <ArchitectureAppStructureBoxesMain>
                
                <ArchitectureAppStructureBoxesMainElement>
                    <ArchitectureToolBarsTopBar
                        class="TopBar"
                    />
                </ArchitectureAppStructureBoxesMainElement>
                    <slot name="tabs">

                    </slot>
                <ArchitectureFlexGrowVerticalScroll>
                    <ArchitectureAppStructureBoxesMainElement>
                        <TH1>
                            <slot name="title">

                            </slot>
                        </TH1>
                    </ArchitectureAppStructureBoxesMainElement>
                    

                    <div class="marTop10">
                        <slot name="header" >

                        </slot>
                    </div>
                    
                    <slot name="noScrollMain">
                        
                    </slot>

                    <div class="scrollContentMinHeight">
                        <slot name="scrollMain">

                        </slot>
                    </div>
                </ArchitectureFlexGrowVerticalScroll>
            </ArchitectureAppStructureBoxesMain>

            <ArchitectureAppStructureBoxesRight>

            </ArchitectureAppStructureBoxesRight>
        </div>

        <ArchitectureOverlayItemViewerMain />

        <div class="mobile_bottomBar">
            <ArchitectureToolBarsBottomBar />
        </div>
    </div>
</template>

<style scoped>

.scrollContentMinHeight {
    height: max(50vh, auto);
}

/* .contentWidth {
    width: min(780px, 100%);
} */

.mobile_bottomBar {
    height: 50px;
    border-top: 1px solid var(--main-dimmed);
}

@media (min-width: 769px) {
    .TopBar {
        display: none;
    }
    .mobile_bottomBar {
        display: none;
    }
}


</style>
