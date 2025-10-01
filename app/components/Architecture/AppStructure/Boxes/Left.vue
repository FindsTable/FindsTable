<template>
    <nav 
        id="architecture-leftBox"
        class="
            sideBarBox relative
        " 
        :class="{ 
            'active' : useAppState().value.showSideBar
        }"
    >
        <slot />
    </nav>
</template>

<style scoped>
@media (max-width: 768px) {
    .TopBar {
        display: flex;
    }
    .mobile_bottomBar {
        display: flex;
    }
    .sideBarBox {
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        transform: translateX(-100%);
        transition: transform 0.3s ease;
        z-index: 1000;
    }
    .sideBarBox.active {
        transform: translateX(0%);
    }
}
</style>