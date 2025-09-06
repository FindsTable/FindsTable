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
        public: Boolean,
        value: String,
        key: String,
        user: String
    }
})

const fieldId = computed( () => {
    return `credentials-${props.fieldData?.key}`
})

const fieldType = computed(() => {
    if(props.fieldData.key === 'email') {
        return 'email'
    }
    return 'text'
})

const fieldRef = useTemplateRef('field') // to toggle the editing state
const isPublic = ref(props.fieldData?.public)

watch(isPublic, async (newValue) => {

    const res = await useNuxtApp().$items.update({
        collection: 'Personal_data_values',
        id: props.fieldData.id,
        body: {
            public: newValue
        },
        query: {
            fields: 'id,value,key,public'
        }
    })
    if(res?.ok) {
        userState.value.personalDataRecord[props.fieldData.key].public = res.data.public
    }
} )

async function saveChanges(newValue) {

    const res = await useUpdateMe_recordValue({
        body: {
            id: props.fieldData.id,
            key: props.fieldData.key,
            value: newValue
        }
    })

    if(res?.ok) {
        fieldRef.value.editing = false
        useUserState().value.personalDataRecord[props.fieldData.key] = res.data
    }
}

</script>

<template>
    <div class="flex column gap10" v-if="fieldData">
        <div class="flex justifyBetween">
            <label :for="fieldId">
                {{ t(`page.settings.tabs.account.sections.credentials.${fieldData.key}`) }} :
            </label>

            <div class="switchBox flex alignCenter gap10 ">
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
            :id="fieldId"
            @saveNewFieldValue="saveChanges"
        />
    </div>
</template>

<style scoped>
.visibilityIcon {
    height: 100%;
}
</style>