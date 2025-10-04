<script setup>
import { 
    FormsToggleEditInput,
    FormsSwitch as Switch
} from '#components';

const { t } = useI18n() 
const userState = useUserState()

const props = defineProps({
    fieldData: {
        id: String,
        isPublic: Boolean,
        value: String,
        key: String,
        user: String
    }
})

const inputId = computed( () => {
    return `credentials-${props.fieldData?.key}`
})

const fieldType = computed(() => {
    if(props.fieldData.key === 'email') {
        return 'email'
    }
    return 'text'
})

const fieldRef = useTemplateRef('field') // to toggle the editing state
const isPublic = ref(props.fieldData?.isPublic)

watch(isPublic, async (newValue) => {

    try {
        const res = await $fetch(
            '/api/me/update/record-value',
            {
                method: 'PATCH',
                headers: {
                    authorization: `Bearer ${useUserState().value.accessToken.value}`
                },
                body: {
                    personalDataRecord: [
                        {
                            id: userState.value.id,
                            [props.fieldData.key]: {
                                id: props.fieldData.id,
                                isPublic: newValue
                            }
                        }
                    ]
                },
                query: {
                    fields: `id,personaDataRecord.${props.fieldData.key}.*`
                }
            }
        )  

        userState.value.personalDataRecord[props.fieldData.key].isPublic = newValue
    } catch(err) {
        console.log('error', err.data)
        // useHandleError(err)
    }
} )

async function saveChanges(newValue) {
    try {
        const res = await $fetch(
            '/api/me/update/record-value',
            {
                method: 'PATCH',
                headers: {
                    authorization: `Bearer ${useUserState().value.accessToken.value}`
                },
                body: {
                    email: props.fieldData.key === "email" ? newValue : undefined,
                    personalDataRecord: [
                        {
                            id: userState.value.id,
                            [props.fieldData.key]: {
                                id: props.fieldData.id,
                                value: newValue
                            }
                        }
                    ]
                },
                query: {
                    fields: `id,personaDataRecord.${props.fieldData.key}.*`
                }
            }
        )
        console.log(res)
        fieldRef.value.editing = false
    } catch(err) {
        useHandleError(err)
    }
}

</script>

<template>
    <div class="flex column gap10" v-if="fieldData">
        <div class="flex justifyBetween">
            <label :for="inputId">
                {{ t(`page.settings.tabs.account.sections.credentials.${fieldData.key}`) }} :
            </label>

            <div class="switchBox flex alignCenter gap10">
                <Icon class="visibilityIcon" :name="isPublic ? 'visible' : 'notVisible'" />

                <Switch 
                    v-model="isPublic"
                />
            </div>
        </div>

        <FormsToggleEditInput 
            ref="field"
            :type="fieldType"
            :originalValue="fieldData.value"
            :id="inputId"
            @saveNewFieldValue="saveChanges"
        />
    </div>
</template>

<style scoped>
.visibilityIcon {
    height: 100%;
}
</style>