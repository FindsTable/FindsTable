<script setup>
import { 
    ArchitectureFlexGrowScrollableChild as FlexGrowScroll,
} from '#components'
const appState = useAppState()
</script>

<template>
    <div class="full flex column justifyEnd">
        <div class="grow flex w100 relative">
            <nav class="sideBarBox relative" :class="{ 
                    'active' : appState.showSideBar
                }">
                <ArchitectureSideBarMain />
            </nav>

            <div class="relative grow h100">
                <div class="
                        contentWidth 
                        absoluteFull 
                        safeArea -full
                        flex column
                    ">
                    <nav>
                        <slot name="tabs">

                        </slot>
                    </nav>

                    <main class="overflowScroll flex column h100 marTop20">
                        <TH1>
                            <slot name="title">

                            </slot>
                        </TH1>

                        <slot name="header">

                        </slot>

                        <slot name="noScrollMain">

                        </slot>

                        <div class="scrollContentMinHeight marTop20">
                            <slot name="scrollMain">


                            </slot>
                        </div>

                        <ArchitectureFooter class="marTop50" />
                    </main>
                </div>
            </div>
        </div>

        <div class="mobile_bottomBar">
            <ArchitectureMobileBottomBar />
        </div>
    </div>
</template>

<style scoped>
.scrollContentMinHeight {
    height: max(50vh, auto);
}
.contentWidth {
    width: min(780px, 100%);
    margin: auto;
}
.sideBarBox {
    width: 200px;
}
.mobile_bottomBar {
    height: 50px;
    border-top: 1px solid var(--main-dimmed);
}

@media (min-width: 769px) {
    .mobile_bottomBar {
        display: none;
    }
    .adaptToSideNar {
        padding-left: 100px;
    }
}

@media (max-width: 768px) {
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
