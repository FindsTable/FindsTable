<template>
    <div class="sideBar theme-surface-1 full flex column justifyBetween">
        
        
        
        <div
            class="flex column gap10"
        >
            <ArchitectureSideBarHomeButtonMain />
            <ArchitectureSideBarMainContentFlowMain
                class="column gap10"
            />
        </div>

        <ArchitectureSideBarMenuMain />

        <ArchitectureSideBarWidgetsMain />
    </div>
</template>

<style scoped>
.sideBar {
    padding: 8px;
}

</style>