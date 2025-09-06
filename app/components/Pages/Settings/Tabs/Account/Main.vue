<script setup>
import { 
    PagesSettingsTabsAccountAvatarMain as Avatar,
    PagesSettingsTabsAccountCredentialsMain as Credentials,
    PagesSettingsTabsAccountBadgesMain as Badges,
    PagesSettingsTabsAccountDangerZoneMain as DangerZone
} from '#components'

</script>

<template>
    <div class="box">
        <Avatar />

        <Badges />

        <Credentials />

        <DangerZone />
    </div>
</template>

<style scoped>
.box {
    padding-bottom: 300px;
}
</style>