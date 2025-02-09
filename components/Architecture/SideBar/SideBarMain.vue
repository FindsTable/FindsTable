<script setup>
import { ArchitectureSideBarLegalLinks, WidgetsFullScreenMain as FullScreen } from '#components';

</script>

<template>

    <div class="sideBar theme-surface-1 full flex column justifyBetween">
        <NuxtLink :to="useAppConfig().welcomeUrl" class="
                font-findsTable-display
                font-mod-small
                theme-titleColor-main
                pointer
                flex alignCenter gap10
            ">

            <Icon name="home" size="22px" />

            <span>
                Finds Table
            </span>
        </NuxtLink>

        <ArchitectureSideBarLinksMain />

        <div class="flex column">
            <div class="optionBar flex alignCenter">
                <WidgetsLogout />

                <NuxtLink to="/settings" class="flex alignCenter pointer">
                    <Icon name="cog" size="1.5rem" />
                </NuxtLink>

                <FullScreen />
            </div>

            <ArchitectureSideBarAccountCard />

            <ArchitectureSideBarLegalLinks />
        </div>
    </div>
</template>

<style scoped>
.sideBar {
    padding: 8px;
}
.optionBar {
    gap: 10px;
    padding: 12px 8px;
}
</style>