<script setup>
import {
    ArchitecturePanelMain as Panel
} from '#components'

const { t } = useI18n();
const user = useUserState()

const editingField = ref('')
</script>

<template>
    <Panel class="panel">
        <TH2>
            <slot name="H2">

            </slot>
        </TH2>

        <div class="mainBox flex column gap10">
            <slot name="content" />
        </div>
    </Panel>
</template>

<style scoped>
.mainBox {
    padding-top: 10px;
}
</style>