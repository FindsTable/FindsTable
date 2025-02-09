<script setup>
const props = defineProps({
    label: String,
    placeholder: String,
    newContentCollection: String,
    itemsCreateParams: Function
})
const emit = defineEmits(['newContentSaved'])
const textContent = ref("")

async function handleClick() {
    const res = await useNuxtApp().$items.create(props.itemsCreateParams(textContent.value))

    if (res?.data) {
        emit('newContentSaved', res.data)
        textContent.value = ''
    }
}
const textareaId = useId()
</script>


<template>
    <form class="flex theme-surface-2">
        <label :for="textareaId">
            {{ label }}
        </label>

        <textarea v-model="textContent"
            :id="textareaId"
            class="
                theme-surface-2 font-text -semibold
                grow
            "
            :class="[ 
                textContent ? 'active' : '',
                textContent ? 'overflowScroll -scrollY' : 'overflowHidden'

            ]"
            :placeholder="placeholder"
        >

        </textarea>

        <div class="flex alignEnd">
            <button @click.prevent="handleClick">
                <Icon name="send" class="theme-textColor-main pointer" />
            </button>
        </div>
    </form>
</template>

<style scoped>
form {
    --textarea-padding-size-closed: 10px;
    --textarea-padding-size-open: 15px;
    border-radius: 10px;
}

form:has(textarea:focus) {
    outline: 1px solid white;
}

textarea {
    padding: var(--textarea-padding-size-closed);
    width: 100%;
    background-color: var(--theme-backdropColor);
    border: none;
    outline: none;
    height: calc(1rem + (2 * var(--textarea-padding-size-closed)));
        resize: none;
}

textarea:focus,
textarea.active {
    height: calc(3rem + (3 * var(--textarea-padding-size-open)));
    padding: var(--textarea-padding-size-open);
}


button {
    padding: 5px;
}
</style>