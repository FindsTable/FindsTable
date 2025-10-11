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
        iconName="content"
        title="Find"
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
    <ArchitectureAppStructureBoxesMainElement
        
    >
        <ArchitecturePanelMain>
            <TH1>
                {{ item.title }}
            </TH1>

            <div class="marTop20">
                <div v-if="item.metals?.length">
                    metal <span v-if="item.metals.length > 1">s</span> : <span v-for="metal in item.metals">{{ metal.Metals_id.id }}</span>
                </div>

                <div>
                    date: {{ item.dating_year_marked }}
                </div>
            </div>

            <div 
                v-if="item.description.length > 1"
                class="marTop20"
            >
                {{ item.description }}
            </div>
        </ArchitecturePanelMain>
    </ArchitectureAppStructureBoxesMainElement>
    
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

            </div>

            <HtmlPictureMain
                v-if="item.image0"
                :assetId="item.image0"
                :sources="[
                    { presetKey: 'find-250-webp', mimeType: 'image/webp' }
                ]"
                fallbackUrl="/images/find-no-image.png"
                class="w100"
            />

            <HtmlPictureMain
                v-if="item.image1"
                :assetId="item.image1"
                :sources="[
                    { presetKey: 'find-250-webp', mimeType: 'image/webp' }
                ]"
                fallbackUrl="/images/find-no-image.png"
                class="w100"
            />

            <div class="infoBox flex justifyEvenly alignCenter gap10">
                <WidgetsLikesAndCommentsMain
                    fonSize="16px"
                    iconSize="20px"
                    collection="Finds"
                    :item="item"
                    :likeClick="true"
                    :commentClick="true"
                    @commentClicked="showComments = !showComments"
                    :bookmark="true"
                    :commentCount="item.comments.length + newCommentCount"
                />
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