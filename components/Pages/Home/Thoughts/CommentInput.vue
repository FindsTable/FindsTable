<script setup>

const props = defineProps({
    thoughtId: String
})
const emit = defineEmits(['newCommentPosted'])
const comment = ref("")

async function handleClick() {


    const res = await useNuxtApp().$items.create({
        collection: 'Thoughts_comments',
        body: {
            content: comment.value,
            thought: props.thoughtId
        },
        query: {
            fields: '*'
        }
    })
    if(res?.data) {
        emit('newCommentPosted')
        comment.value = ''
    }
}
</script>

<template>
    <form class="flex justifyEnd gap20 theme-surface-2 marTop20">
        <input 
            class="grow  theme-surface-2" 
            v-model="comment" 
            type="text" 
            placeholder="écrire un commentaire ..."
        />

        <button @click.prevent="handleClick">
            <Icon name="send" class="theme-textColor-main pointer"/>
        </button>
    </form>
</template>

<style scoped>

input {
    width: 100%;
    background-color: var(--theme-backdropColor);
    border: none;
    outline: none;
    
}
form {
    border-radius: 10px;
}
form:has(input:focus) {
    outline: 1px solid white;
}
button {
    padding: 5px;
}
</style>