<script setup>
import { 
    FormsToggleEditInput,
    FormsSwitch as Switch
} from '#components';

const { t } = useI18n() 
const userState = useUserState()

const props = defineProps({
    fieldData: {
        key: String,
        value: String
    },
    prefix: String
})

const fieldId = computed( () => {
    return `credentials-${props.fieldData.key}`
})

const fieldType = computed(() => {
    return 'text'
})

const fieldRef = useTemplateRef('field') // to toggle the editing state

async function saveChanges(newValue) {
    console.log(newValue)
    
    const res = await useUpdateMe_user({
        body: {
            [props.fieldData.key]: props.prefix ? `${props.prefix}${newValue}` : newValue
        },
        query: {
            fields: `${props.fieldData.key}`
        }
    })

    if(res?.data) {
        userState.value[props.fieldData.key] = newValue
        fieldRef.value.editing = false
    }

}
</script>

<template>
    <div class="flex column gap10">
        <div class="flex justifyBetween">
            <label :for="fieldId">
                {{ t(`page.settings.tabs.account.sections.credentials.${fieldData.key}`) }} :
            </label>
        </div>

        <FormsToggleEditInput 
            ref="field"
            :type="fieldType"
            :originalValue="fieldData.value"
            :id="fieldId"
            :prefix="prefix"
            @saveNewFieldValue="saveChanges"
        />
    </div>
</template>

<style scoped>
.visibilityIcon {
    height: 100%;
}
</style>