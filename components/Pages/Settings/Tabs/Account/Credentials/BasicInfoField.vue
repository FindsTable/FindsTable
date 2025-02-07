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
    }
})

const fieldId = computed( () => {
    return `credentials-${props.fieldData.key}`
})

const fieldType = computed(() => {
    return 'text'
})

const fieldRef = useTemplateRef('field') // to toggle the editing state

async function saveChanges(newValue) {
    console.log({
        [props.fieldData.key]: newValue
    })
    const res = await useNuxtApp().$users.updateMe({
        body: {
            [props.fieldData.key]: newValue
        },
        query: {
            fields: `${props.fieldData.key}`
        }
    })

    console.log(res)

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
            @saveNewFieldValue="saveChanges"
        />
    </div>
</template>

<style scoped>
.visibilityIcon {
    height: 100%;
}
</style>