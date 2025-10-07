<script setup lang="ts">
const model = defineModel<any[]>()

interface Props {
  buttonTextPath: String;
  addedFinds: Find[]
}

const props = defineProps<Props>()
const emit = defineEmits(['forgetFind'])

function forgetFind(findId: string) {
    model.value = model.value?.find((f: any )=> f.id !== findId)
}

const { t } = useI18n()

async function openFindSelector() {
    const { openModal } = useModal()

    const selectedFinds = await openModal({
        modal: 'ArchitectureOverlayModalsFindSelector',
        content: {
            title: 'Select finds',
            message: 'asociate finds to your hunt report'
        },
        data: {
            query: {
                filter: {
                    _and: [
                        {
                            owner: {
                                _eq: useUserState().value.id
                            }
                        },
                        {
                            hunt_report: {
                                _eq: null
                            }
                        }
                    ]
                },
                sort: '-date_created',
                fields: [
                    '*',
                    'owner.id',
                    'date_created',
                    'date_updated',
                    'image0, image1'
                ],
                limit: 100
            }
        }
    })

    model.value = selectedFinds as FindId[]
}
</script>

<template>
        <div>
            <div class="flex column gap10">
                <div
                    v-if="addedFinds?.length"
                    class="flex justifyCenter"
                >
                    <div
                        class="find relative"
                        v-for="find in addedFinds" :key="find.id"
                    >
                        <ContentFindsCardSmall
                            :find="find"
                        />

                        <div
                            class="absolute top0 right0 pointer pad5"
                        >
                            <Icon 
                                class=""
                                @click.stop.prevent="forgetFind(find.id)"
                                name="close" size="20px" 
                                
                            />
                        </div>
                    </div>
                </div>

                <div class="flex justifyCenter marTop10">
                    <button 
                        type="button"
                        class="comp-button -filled"
                        @click.stop.prevent="openFindSelector"
                    >
                        {{ t(`${buttonTextPath}`) }}
                    </button>
                </div>

                <!-- Here you will later render the selected finds -->
            </div>
        </div>
</template>

<style scoped>
.sectionLead {
  font-size: 14px;
  color: var(--textColor-dimmed);
  margin-bottom: 10px;
}



.find {
    width: 30%;
}
</style>