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

<template v-if="itel">
    <ArchitectureAppStructureBoxesMainElement>
        <div
            class="topBoxContainer"
        >
            <ArchitecturePanelMain class="pageIconBox theme-surface ">
                <Icon name="content" class="40px" />
            </ArchitecturePanelMain>

            <ArchitecturePanelMain 
                v-if="showUser"
                class="
                    itemTypeTitle flex alignCenter grow
                "
            >
                Find
            </ArchitecturePanelMain>
        </div>
    </ArchitectureAppStructureBoxesMainElement>

    <ArchitectureAppStructureBoxesMainElement>
        <ArchitecturePanelMain>
            <div 
                v-if="showUser"
                class="
                    userBox
                    flex gap10 alignCenter justifyBetween
                    noEvents_kidsEvents
                "
            >
                <NuxtLink 
                    :to="`/users/${item.owner.id}`"
                    @click.stop
                    class="flex gap10"
                >
                    <img v-if="item.owner.avatar"
                        :src="`https://admin.findstable.net/assets/${item.owner.avatar}?key=avatar-tiny-jpg&v=${Date.now()}`"
                        alt="metalhunter avatar" 
                        class="avatar" 
                    />

                    <div

                    >
                        <p
                            class="username"
                        >
                            {{ item.owner.displayName }}
                        </p>

                        <time class="date fS12 weight3" datetime="2025-03-26">
                            {{ useParseDate(item.date_created) }}
                        </time>

                    </div>
                </NuxtLink>

                <ContentBadgesBadgeRecord
                    :userId="item.owner.id"
                />
            </div>

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