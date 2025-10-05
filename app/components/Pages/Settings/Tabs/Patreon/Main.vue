<script setup>
import {
    ArchitecturePanelH2Panel as H2Panel,
} from '#components'
const { t } = useI18n();
const me = useUserState();
</script>

<template>
    <ArchitectureAppStructureBoxesMainElement>
        <H2Panel>
            <template #H2>
                Patreon
            </template>

            <template #content>
                <PatreonMembershipCard  v-if="me.patreon_account?.id"/>

                <PatreonLinkAccountButton v-else />
            </template>
        </H2Panel>
    </ArchitectureAppStructureBoxesMainElement>
</template>