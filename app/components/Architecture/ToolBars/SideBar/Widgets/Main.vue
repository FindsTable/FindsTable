<script setup>
import { 
    WidgetsFullScreenMain as FullScreen 
} from '#components';

</script>

<template>
     <div class="flex column">
        <div class="optionBar flex justifyEvenly alignCenter gap10 w100">
            <WidgetsLogout />

            <NuxtLink to="/settings" class="flex alignCenter pointer">
                <Icon name="cog" size="1.5rem" />
            </NuxtLink>

            <FullScreen />
        </div>

        <ArchitectureToolBarsSideBarLegalLinks />
    </div>
</template>

<style scoped>
.optionBar {
    padding: 12px 8px;
}
</style>