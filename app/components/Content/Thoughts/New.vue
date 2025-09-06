<script setup>
const me = useUserState()

const emit = defineEmits(['newThoughtPosted'])
const props = defineProps({
    showAvatar: {
        type: Boolean,
        default: false
    }
})

const newThought = ref('')

const isPending = ref()

async function saveNewThought() {
    console.log('saving ne thought')

    if(isPending.value === true) return
    isPending.value = true

    const res = await $fetch(
        '/api/content/thoughts/create',
        {
            method: 'POST',
            headers: {
                authorization: `Bearer ${me.value.accessToken.value}`
            },
            body: {
                content: newThought.value
            }
            //query set by the backend
        }
    )

    if(res?.ok && res?.data) {
        newThought.value = ''
        emit('newThoughtPosted', res.data)
    }

    isPending.value = false
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
                v-if="showAvatar"
                :fileId="me.avatar"
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
                :class="[
                    newThought ? 'active' : '',
                    newThought ? 'overflowScroll -scrollY' : 'overflowHidden'
                ]"
                placeholder="What's going on ?"
            >

            </textarea>
        </div>
        
        <div 
            v-if="newThought"
            class="flex justifyEnd marTop20"
        >
            <button
                @click="saveNewThought"
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