<script setup>
import { ContentFindsCardShortDetailed } from '#components';

const route = useRoute()

const me = useUserState();
const props = defineProps({
    item: Object,
    showUser: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['delete'])
</script>

<template>
    <ArchitectureAppStructureBoxesMainElement>
        <div
            class="topBoxContainer"
        >
            <ArchitecturePanelMain class="pageIconBox theme-surface ">
                <Icon name="book" class="40px" />
            </ArchitecturePanelMain>

            <ArchitecturePanelMain 
                v-if="showUser"
                class="
                    itemTypeTitle flex alignCenter grow
                "
            >
                Hunt report
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
    <!-- <ArchitectureAppStructureBoxesMainElement>
        <div
            class="flex gap10"
        >
            <ArchitecturePanelMain class="pageIconBox theme-surface">
                <Icon name="book" size="50px" />
            </ArchitecturePanelMain>

            <ArchitecturePanelMain 
                v-if="showUser"
                class="
                    userBox grow
                    flex justifyBetween gap10
                    noEvents_kidsEvents
                "
            >
                <NuxtLink 
                    :to="`/users/${item.owner.id}`"
                    @click.stop
                    class="grow flex gap10"
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

                <div class="grow badgeRecordFrame relative">
                    <ContentBadgesBadgeRecord
                        :userId="item.owner.id"
                        class="absolute top0 right0 h100"
                    />
                </div>
            </ArchitecturePanelMain>
        </div>
    </ArchitectureAppStructureBoxesMainElement> -->

    <ArchitectureAppStructureBoxesMainElement>
        <ArchitecturePanelH2Panel
            v-if="item.content.length > 2"
        >
            <template #H2>
                {{ item.title }}
            </template>
            
            <template #content>
                <p>
                    {{ item.content }}
                </p>

                <p>
                    biome: {{ item.biome }}
                </p>
            </template>
        </ArchitecturePanelH2Panel>
    </ArchitectureAppStructureBoxesMainElement>

    <ArchitectureAppStructureBoxesMainElement>
        <ArchitecturePanelH2Panel>
            <template #H2>
                Pouch
            </template>

            <template #content>
                <img :src="`https://admin.findstable.net/assets/${item.bootyPhoto}`">
            </template>
        </ArchitecturePanelH2Panel>
    </ArchitectureAppStructureBoxesMainElement>

    <ArchitectureAppStructureBoxesMainElement
        v-if="item.finds?.length"
    >
        <NuxtLink
            v-for="find in item.finds" :key="find.id"
            :to="`/users/${find.owner.id}/Finds/${find.id}`"
            class="pointer"
        >
            <ArchitecturePanelH2Panel>
                <template #H2>
                    Finds
                </template>

                <template #content>
                    <div class="">
                        <div class="frame">
                            <ContentFindsCardShortDetailed
                                :item="find"
                            />
                        </div>
                    </div>
                </template>
            </ArchitecturePanelH2Panel>
        </NuxtLink>
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
.pageIconBox {
    aspect-ratio: 1;
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