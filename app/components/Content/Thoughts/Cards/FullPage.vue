<script setup>
const props = defineProps({
    item: Object,
    showUser: {
        type: Boolean,
        default: false
    }
})

const me = useUserState()

</script>

<template v-if="item">
    <ArchitecturePageHeaderIconAndTitle
        iconName="chat"
        title="Thought"
    />

    <ArchitectureAppStructureBoxesMainElement>
        <ArchitecturePanelMain>
            <ContentItemsTopBarUser
                v-if="item?.owner?.id && showUser"
                :userId="item.owner.id"
                :date="useParseDate(item.date_created)"
                hideBorderBottom
            />
        </ArchitecturePanelMain>
    </ArchitectureAppStructureBoxesMainElement>

    <!-- 
        !!!!!
            v-if="find.description.length > 1"
        !!!!!!!!

        Empty description is equal to " ".  Se the dirty hack
        in /components/pages/finds/new/form that keeps directus happy
    -->
    
    <ArchitectureAppStructureBoxesMainElement>
         <ArchitecturePanelMain 
            v-if="item" 
            class="
                card 
                w100
                flex column gap10 justifyEnd
            "
        >
            <div
                class="flex justifyBetween"
            >
                {{ item.content }}
            </div>

            <div 
                v-if="item"
                class="centered marTop20"
            >

            </div>
        </ArchitecturePanelMain>
    </ArchitectureAppStructureBoxesMainElement>

    <ArchitectureAppStructureBoxesMainElement>
        <ContentCommentsMain
            v-if="item"
            :itemId="item.id"
            collection="Finds_comments"
        />
    </ArchitectureAppStructureBoxesMainElement>

</template>

<style scoped>

.avatar {
    height: 100%;
    aspect-ratio: 1;
    border-radius: 50%;
    object-fit: cover;
}

.username {
    font-size: 13px;
    font-weight: 600;
}
</style>