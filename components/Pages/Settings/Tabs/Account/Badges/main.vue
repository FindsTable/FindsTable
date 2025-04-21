<script setup>
import {
    ArchitecturePageSectionsH2Panel as H2Panel,
    PagesSettingsTabsAccountAvatarSelectNew as SelectNewAvatar,
    PagesSettingsTabsAccountAvatarCurrent as CurrentAvatar,
    PagesSettingsTabsAccountAvatarCollection as Collection,
} from '#components'

const { t } = useI18n()

const userContent = useUserContent()
const selectingBadge = ref('')

const { data : allOwnedBadges } = useAsyncData(
    'allBadges',
    async () => {
        const {
            differedFetch
        } = useDirectAsyncFetch(
            'GET', '/items/Badges',
            {
                dirrered: true,
                query: {
                    fields: '*,translations.*'
                }
            }
        )
        const res = await differedFetch()

        const ownedBadges = res.filter((badge) => userContent.value.badgeRecord[badge.key])
        console.log(ownedBadges)
        return ownedBadges
    }
)

async function handleNewBadge(badge) {

    const res = await useNuxtApp().$items.update({
        collection: 'Badge_records',
        id: userContent.value.badgeRecord.id,
        body: {
            [selectingBadge.value]: badge.key
        },
        query: {
            fields: '*'
        }
    })

    await useNuxtApp().$content.refreshBadgeRecord()

    selectingBadge.value = ''
}

async function clearSlot(slot) {
    const res = await useNuxtApp().$items.update({
        collection: 'Badge_records',
        id: userContent.value.badgeRecord.id,
        body: {
            [slot]: null
        }
    })

    await useNuxtApp().$content.refreshBadgeRecord()
}

function badgeSlotFileId(slot) {
    
    const badgeKey = userContent.value.badgeRecord[slot].key
    const badgeLevel = userContent.value.badgeRecord[badgeKey]

    return userContent.value.badgeRecord[slot][badgeLevel]

}

function badgeIsAvailableToBePlacedInSlot(badgeKey) {

    if(
        userContent.value.badgeRecord.slot1?.key === badgeKey ||
        userContent.value.badgeRecord.slot2?.key === badgeKey ||
        userContent.value.badgeRecord.slot3?.key === badgeKey
    ) {
        return false
    }
    return true
}

const selectedOwnedBadge = ref('')

function selectOwnedBadge(badgeKey) {
    if(selectedOwnedBadge.value === badgeKey) {
        selectedOwnedBadge.value = ''
        return
    }

    selectedOwnedBadge.value = badgeKey
}
</script>

<template>
    <H2Panel>
        <template #H2>
            {{ t('page.settings.tabs.account.sections.badges.title') }}
        </template>
        
        <template #content>
            <p>
                {{ t('page.settings.tabs.account.sections.badges.introText') }}
            </p>

            <div class="marTop20">
                <div
                    v-if="!selectingBadge"
                    class="flex gap20 slotBox"
                >
                    <div>
                        <div 
                            @click="selectingBadge = 'slot1'"
                            class="slot slot1 centered pointer"
                        >
                            <img v-if="userContent.badgeRecord?.slot1" :src="`https://admin.findstable.net/assets/${badgeSlotFileId('slot1')}?key=badge-h150-q100-png`" alt="">

                            <Icon v-else name="plus" size="50px"/>
                        </div>

                        <button 
                            class="marTop20 selectButton comp-button -filled -bold w100"
                            @click="clearSlot('slot1')"
                        >
                            clear
                        </button>
                    </div>


                    <div>
                        <div class="slot slot2 centered pointer" @click="selectingBadge = 'slot2'">
                            <img v-if="userContent.badgeRecord?.slot2" :src="`https://admin.findstable.net/assets/${badgeSlotFileId('slot2')}?key=badge-h150-q100-png`" alt="">

                            <Icon v-else name="plus" size="50px" />
                        </div>

                        <button 
                            class="marTop20 selectButton comp-button -filled -bold w100"
                            @click="clearSlot('slot2')"
                        >
                            clear
                        </button>
                    </div>

                    <div>
                        <div class="slot slot3 centered pointer" @click="selectingBadge = 'slot3'">
                            <img v-if="userContent.badgeRecord?.slot3" :src="`https://admin.findstable.net/assets/${badgeSlotFileId('slot3')}?key=badge-h150-q100-png`" alt="">

                            <Icon v-else name="plus" size="50px" />
                        </div>

                        <button 
                            class="marTop20 selectButton comp-button -filled -bold w100"
                            @click="clearSlot('slot3')"
                        >
                            clear
                        </button>
                    </div>
                </div>

                <div 
                    v-if="selectingBadge && allOwnedBadges"
                    class="selectionBox"
                >
                    <button @click="selectingBadge = false" class="pointer">
                        <Icon name="back" size="32px" class="theme-textColor-main" />
                    </button>

                    <div class="badge flex gap20">
                        <div
                            v-for="badge in allOwnedBadges" :key="badge.key"
                        >
                            <ContentBadgesFrameMain 
                            
                                @click="selectOwnedBadge(badge.key)"
                                :badge="badge"
                                :selected="selectedOwnedBadge === badge.key ? true : false"
                            />
                            <button 
                                class="marTop20 selectButton comp-button -filled -bold w100"
                                :disabled="!badgeIsAvailableToBePlacedInSlot(badge.key)"
                                @click="handleNewBadge(badge)"
                            >
                                select
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </H2Panel>
</template>

<style scoped>
.slot {
    height: 150px;
    aspect-ratio: 1;
    padding: 10px;
    border: 1px solid rgba(86, 86, 86, 0.838);
    border-radius: 10px;
}
img {
    height: 100%;
}
.available {
    cursor: pointer;
}
.unavailable {
    
    filter: saturate(0);
    cursor: not-allowed;
}
.selectButton {
    padding: 10px 0;
}
.selectButton:disabled {
    filter: saturate(0) brightness(0.5);
}
</style>