<script setup>
import {
    ArchitecturePageSectionsH2Panel as H2Panel,
} from '#components'
const { t } = useI18n();

const userState = useUserState()

</script>

<template>
    <H2Panel>
        <template #H2>
            Patreon
        </template>

        <template #content>
            <PatreonMembershipCard  v-if="userState.patreon_account?.id"/>

            <PatreonLinkAccountButton v-else />
        </template>
    </H2Panel>
</template>