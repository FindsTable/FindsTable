<script setup>
const userState = useUserState();
const { t } = useI18n();

const props = defineProps({
    type: {
        // type: 'text' | 'password' | 'email' | 'textarea',
        type: String
    },
    id: {
        type: String,
        required: true,
    },
    originalValue: {
        type: String,
        default: '',
    },
    prefix: String
})

const emit = defineEmits(['saveNewFieldValue']);
const fieldRef = ref(null)
const editing = ref(false);
defineExpose({ editing });
const fieldValue = ref(props.originalValue);

function editStart() {
    editing.value = true;
    setTimeout(() => {
        fieldRef.value.focus()
    }, 100)
}
async function handleSaveChanges() {
    emit('saveNewFieldValue', fieldValue.value)
}
function cancelEdit() {
    fieldValue.value = props.originalValue
    editing.value = false;
}
</script>

<template>
    <div class="fieldBox flex alignCenter" :class="{ 'active': editing }">
        <p class="
                font-text -big theme-textColor-main
                noSelection
            ">
            {{ prefix }}
        </p>

        <input ref="fieldRef" :id="id" class="font-text -big theme-textColor-main" :class="{ 'active': editing }"
            :type="type" v-model="fieldValue" :readonly="!editing" :disabled="!editing">

        <div class="iconBox flex gap10">
            <Icon v-if="!editing" @click="editStart" name="edit" class="icon edit pointer" />

            <Icon v-if="editing" @click="cancelEdit" name="close" class="icon close pointer" />

            <Icon v-if="editing" @click="handleSaveChanges" name="checkCircle" class="icon check pointer" />
        </div>
    </div>
</template>

<style scoped>
.fieldBox{
    padding: 6px 3px 6px 12px;
    border: 1px solid var( --main-dimmed);
    border-radius: 8px;
}
.fieldBox.active {
    outline: 1px solid white;
}
input {
    flex-grow:  1;
}
input[type="text"],
input[type="password"],
input[type="email"]{
    color: var(--main-text-color);
    /* background-color: var(--main-background-color); */
    background-color: transparent;
}
input:focus {
    outline: none;
}
.iconBox {
    padding: 0 8px;
}
.icon.check {
    color: green;
}
</style>