<script setup>
const props = defineProps({
    iconName: {
        type: String,
        required: false
    },
    title: {
        type: String,
        required: true
    },
    avatarId: {
        type: String,
        required: false
    }
})
</script>

<template>
    <ArchitectureAppStructureBoxesMainElement>
        <div
            class="topBoxContainer"
        >
            <ArchitecturePanelMain class="pageIconBox theme-surface ">
                <Icon 
                    v-if="iconName"
                    :name="iconName" size="33px"
                />

                <div
                    v-else
                    class="full"
                >
                    <slot name="icon" />
                </div>
            </ArchitecturePanelMain>

            <ArchitecturePanelMain 
                class="
                    itemTypeTitle flex alignCenter grow
                "
            >
                <p
                    class="
                    title
                "
                >
                    {{ title }}
                </p>
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
    overflow: hidden;
}
.title {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
</style>