<template>
    <div class="sideBar theme-surface-1 full flex column justifyBetween">
        
        
        
        <div
            class="flex column gap10"
        >
            <ArchitectureToolBarsSideBarHomeButtonMain />
            <ArchitectureToolBarsMainContentFlowMain
                class="column gap10"
            />
        </div>

        <ArchitectureToolBarsSideBarMenuMain />

        <ArchitectureToolBarsSideBarWidgetsMain />
    </div>
</template>

<style scoped>
.sideBar {
    padding: 8px;
}

</style>