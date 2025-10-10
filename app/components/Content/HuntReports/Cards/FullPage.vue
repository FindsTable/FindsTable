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
    <ArchitecturePageHeaderIconAndTitle
        iconName="book"
        title="Hunt report"
    />

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

                <!-- <ContentBadgesBadgeRecordPublic
                    :userId="item.owner.id"
                /> -->
            </div>

        </ArchitecturePanelMain>
    </ArchitectureAppStructureBoxesMainElement>

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