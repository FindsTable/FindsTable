<script setup>
const me = useUserState()

const emit = defineEmits(['newThoughtPosted'])

const myContent = useUserContent()

const newThought = ref('')

async function handleNewComment() {
    const res = await useNuxtApp().$items.create({
        collection: 'Thoughts',
        body: {
            content: newThought.value
        },
        query: {
            fields: '*,user_created.avatars.*,user_created.id,user_created.displayName,user_created.username,date_created'
        }
    })

    if(res?.data) {
        newThought.value = ''
        emit('newThoughtPosted', res.data)
    }
}
</script>

<template>
    <div 
        class="
            box
            comp-panel -surface1
        "
    >
        <div 
            class="
                flex alignStart gap20
            "
        >
            <ArchitectureFramesAvatar
                :fileId="myContent.avatars[0]?.image"
                round
                width="32px"
            />

            <textarea
                v-model="newThought"
                class="
                    content 
                    theme-surface-2 font-text -semibold
                    grow    
                "
                :class="[newThought ? 'active' : '']"
                placeholder="What's going on ?"
            >

            </textarea>
        </div>
        
        <div 
            v-if="newThought"
            class="flex justifyEnd marTop20"
        >
            <button
                @click="handleNewComment"
                class="comp-button -filled"
            >
                publish
            </button>
        </div>
    </div>
</template>

<style scoped>
.box {
    --padding-closed: 8px;
    --padding-open: 15px;
    padding: 15px;
    border-radius: 10px;
}
textarea {
    padding: var(--padding-closed);
    border: none;
    border-radius: 10px;
    resize: none;
    height: calc(1rem + (2 * var(--padding-closed)));
}
textarea.active,
textarea:focus {
    height: calc(3rem + (2 * var(--padding-open)));
    padding: var(--padding-open);
}
textarea:focus {
    outline: 1px solid white;
}
</style>