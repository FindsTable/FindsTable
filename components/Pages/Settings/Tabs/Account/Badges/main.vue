<script setup>
    import {
        ArchitecturePageSectionsH2Panel as H2Panel
    } from '#components'

    const { t } = useI18n()
    const { directFetch } = useDirectAsyncFetch()

    const userContent = useUserContent()

    const selectedSlot = ref('')

    async function updateSlot(slot, newValue) {
        const { response } = await directFetch(
            'PATCH', `/items/Badge_records/${userContent.value.badgeRecord.id}`,
            {
                body: {
                    [slot]: newValue
                },
                query: { fields: '*' }
            }
        )

        return response
    }

    async function handleNewBadge(badgeKey) {

        const response = await updateSlot(selectedSlot.value, badgeKey)

        if(response) {
            userContent.value.badgeRecord = response
        }

        selectedSlot.value = ''
    }

    async function clearSlot(slot) {
        const response = await updateSlot(slot, null)

        if(response) {
            userContent.value.badgeRecord = response
        }

        selectedSlot.value = ''
    }


    function badgeIsAvailableToBePlacedInSlot(badgeKey) {
        const record = userContent.value.badgeRecord
        if(
            record.slot1 === badgeKey ||
            record.slot2 === badgeKey ||
            record.slot3 === badgeKey
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

    function getPublicBadge(badgeKey) {
        const badge = findInLocalState(
            'appContent', 
            'badges', 
            (badge) => {
                return badge.key === badgeKey
            }
        )
            
        return badge ? badge : undefined
    }
    const slots = [ 'slot1', 'slot2', 'slot3']

    const slotImageUrl = (slot) => {
        //generate the url for the uer's level
        const badgeKey = userContent.value.badgeRecord[slot]
        if(!badgeKey) {
            return undefined
        }
        const userBadge = findInLocalState(
            'userContent', 
            'badges', 
            (badge) => {
                return badge.badge === badgeKey
            }
        )

        const imageId = userBadge.level.image
        return imageId ? `https://admin.findstable.net/assets/${imageId}` : undefined
    }

    const noAvailableBadges = ref(false) // to toggle error message
    function availableBadges(badges) {
        //returns only the ones that are not already places in a slot

        const available = badges.filter((b) => {
            return  badgeIsAvailableToBePlacedInSlot(b.badge)
        })

        noAvailableBadges.value = available.length ? false : true
        return available
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
                    v-if="!selectedSlot"
                    class="flex gap20"
                >
                    <div
                        v-for="slot in slots" :key="slot"
                    >
                        <div 
                            @click="selectedSlot = slot"
                            class="slot centered pointer"
                        >
                            <img 
                                v-if="slotImageUrl(slot)" 
                                :src="slotImageUrl(slot)" 
                                alt=""
                                class="full objectFitContain"
                            >

                            <Icon
                                v-else 
                                name="plus" 
                                size="50px"
                            />
                        </div>

                        <button 
                            class="marTop20 selectButton comp-button -filled -bold w100"
                            @click="clearSlot(slot)"
                        >
                            clear
                        </button>
                    </div>
                </div>

                <div 
                    v-if="selectedSlot && userContent.badges.length"
                    class="selectionBox"
                >
                    

                    <button 
                        @click="selectedSlot = false"
                        class="pointer"
                    >
                        <Icon name="back" size="32px" class="theme-textColor-main" />
                    </button>

                    <p
                        v-if="noAvailableBadges"
                        class="comp-panel -surface2 font-h2 pad20"
                    >
                        Vous avez déjà utilisé tous vous badges
                    </p>

                    <div class="badge flex gap20">
                        <div
                            v-for="owned in availableBadges(userContent.badges)" :key="owned.id"
                        >
                            <ContentBadgesFrameMain
                                @click="selectOwnedBadge(owned.badge)"
                                :badge="getPublicBadge(owned.badge)"
                                :selected="selectedOwnedBadge === owned.badge ? true : false"
                            />

                            <button 
                                class="marTop20 selectButton comp-button -filled -bold w100"
                                :disabled="!badgeIsAvailableToBePlacedInSlot(owned.badge)"
                                @click="handleNewBadge(owned.badge)"
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
    flex-grow: 0;
    height: 150px;
    aspect-ratio: 1;
    padding: 10px;
    border: 1px solid rgba(86, 86, 86, 0.838);
    border-radius: 10px;
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