<script setup>
const props = defineProps({
    iconName: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    }
})
</script>

<template>
    <ArchitectureAppStructureBoxesMainElement>
        <div
            class="topBoxContainer"
        >
            <ArchitecturePanelMain class="pageIconBox theme-surface ">
                <Icon :name="iconName" size="33px" />
            </ArchitecturePanelMain>

            <ArchitecturePanelMain 
                class="
                    itemTypeTitle flex alignCenter grow
                "
            >
                {{ title }}
            </ArchitecturePanelMain>
        </div>
    </ArchitectureAppStructureBoxesMainElement>
</template>

<style scoped>
.topBoxContainer {
    height: 4rem;
    display: flex;
    gap: 10px;
    align-items: stretch;

}
.pageIconBox {
    height: 100%;
    aspect-ratio: 1;
}
.itemTypeTitle {
    font-size: 2rem;
    font-family: var(--typeface-findsTable); 
}
</style>