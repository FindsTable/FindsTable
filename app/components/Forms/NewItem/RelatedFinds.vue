<script setup lang="ts">
const model = defineModel<FindId[]>()

const props = defineProps({
  labelPath: String,
  leadPath: String,
  buttonTextPath: String
})

const { t } = useI18n()

async function openFindSelector() {
    const { openModal } = useModal()

    const selectedFinds = await openModal({
        modal: 'ArchitectureOverlayModalsFindSelector',
        content: {
            title: 'Join some finds',
            message: 'Choose the finds you want to associate with this hunt report.'
        },
        data: {
            query: {
                filter: {
                    owner: {
                        _eq: useUserState().value.id
                    }
                },
                sort: '-date_created',
                fields: [
                    '*',
                    'owner',
                    'owner.id',
                    'owner.displayName',
                    'owner.username',
                    'date_created',
                    'date_lastEvent',
                    'date_updated',
                    'images.*',
                    'likes.*',
                    'likes_count',
                    'comments.*'
                ],
                limit: 100
            }
        }
    })

    model.value = selectedFinds as FindId[]
}
</script>

<template>
    <FormsLabel>
        <template #label>
            {{ t(`${labelPath}`) }}
        </template>
            
        <template #input>
            <div class="flex column gap10 allEvents">
                <p class="sectionLead">
                    {{ t(`${leadPath}`) }}
                </p>

                <div class="flex justifyCenter marTop10">
                    <button 
                        type="button"
                        class="comp-button -filled font-text-main"
                        @click="openFindSelector"
                    >
                        {{ t(`${buttonTextPath}`) }}
                    </button>
                </div>

                <!-- Here you will later render the selected finds -->
            </div>
        </template>
    </FormsLabel>
</template>

<style scoped>
.sectionLead {
  font-size: 14px;
  color: var(--textColor-dimmed);
  margin-bottom: 10px;
}
</style>