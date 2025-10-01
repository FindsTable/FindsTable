<script setup>
import { 
    PagesSettingsTabsAccountAvatarMain as Avatar,
    PagesSettingsTabsAccountCredentialsMain as Credentials,
    PagesSettingsTabsAccountBadgesMain as Badges,
    PagesSettingsTabsAccountDangerZoneMain as DangerZone
} from '#components'

</script>

<template>
    <ArchitectureAppStructureBoxesMainElement>
        <Avatar />
    </ArchitectureAppStructureBoxesMainElement>

    <ArchitectureAppStructureBoxesMainElement>
        <Badges />
    </ArchitectureAppStructureBoxesMainElement>

    <ArchitectureAppStructureBoxesMainElement>
        <Credentials />
    </ArchitectureAppStructureBoxesMainElement>

    <ArchitectureAppStructureBoxesMainElement>
        <DangerZone />
    </ArchitectureAppStructureBoxesMainElement>
</template>

<style scoped>
.box {
    padding-bottom: 300px;
}
</style>