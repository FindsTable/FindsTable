<script setup>
import {
    ArchitecturePanelMain as Panel,
    ArchitecturePageTitlesH2 as H2
} from '#components'

const { t } = useI18n();
const user = useUserState()

const editingField = ref('')
</script>

<template>
    <Panel class="panel">
        <H2>
            <slot name="H2">

            </slot>
        </H2>

        <div class="mainBox flex column gap10">
            <slot name="content" />
        </div>
    </Panel>
</template>

<style scoped>
.panel {
    margin-top: 23px;
}
.mainBox {
    padding-top: 10px;
    padding-left: 10px;
}
</style>