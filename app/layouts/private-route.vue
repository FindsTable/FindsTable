<script setup>
const appState = useAppState()
</script>

<template>
    <div 
        v-if="useUserState().value.isLoggedIn"
        class="full flex column justifyEnd"
    >
        <div class="grow flex w100 relative ">
            <nav class="sideBarBox relative" :class="{ 
                    'active' : appState.showSideBar
                }">
                <ArchitectureSideBarMain />
            </nav>

            <div class="relative grow h100 flex">
                <div class="mainContent relative grow">
                     <div class="
                            absoluteFull 
                            safeArea -full
                            flex column
                        ">

                        <div>
                            <slot name="topBar">
                                <ArchitectureMobileTopBar
                                    class="mobileTopBar"
                                />
                            </slot>
                        </div>

                        <div>
                            <slot name="topContent">
                            </slot>
                        </div>
                        <nav>
                            <slot name="tabs">

                            </slot>
                        </nav>

                        <main class="overflowScroll -scrollY flex column h100 contentBottomSpace">
                            <TH1>
                                <slot name="title">

                                </slot>
                            </TH1>

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
                        </main>
                    </div>
                </div>

                <!-- <div class="liveBox -surface1">

                </div> -->
               
            </div>
        </div>

        <div class="mobile_bottomBar">
            <ArchitectureMobileBottomBar />
        </div>
    </div>
</template>

<style scoped>
.liveBox {
    width: 200px;
}
.scrollContentMinHeight {
    height: max(50vh, auto);
}

.contentWidth {
    width: min(780px, 100%);
}
.sideBarBox {
    width: 200px;
}
.mobile_bottomBar {
    height: 50px;
    border-top: 1px solid var(--main-dimmed);
}

@media (min-width: 769px) {
    .mobileTopBar {
        display: none;
    }
    .mobile_bottomBar {
        display: none;
    }
    .adaptToSideNar {
        padding-left: 100px;
    }
}

@media (max-width: 768px) {
    .mobileTopBar {
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
