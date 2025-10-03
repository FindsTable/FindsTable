<script setup>
const { t } = useI18n()
const me = useUserState()

const emit = defineEmits(['newThoughtPosted'])
const props = defineProps({
    showAvatar: {
        type: Boolean,
        default: false
    },
    windowHeight: String
})

const newThought = ref('')

const isPending = ref()

async function saveNewThought() {

    if(isPending.value === true) return
    isPending.value = true

    try {
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
        console.log(res)

        // newThought.value = ''
        // emit('newThoughtPosted', res.data)

    } catch(err) {
        if(err.data) {
            console.error("data", err.data)
            useToaster('show', {
                id: crypto.randomUUID(),
                message: t(`${err.data.toasterPath}`),
                icon: 'error',
                type: 'error',
                autoClose: true,
                position: 'bottom'
            })
        } 
        if(err.reason) {
            console.error("reason", err.reason)
        }
    }

    isPending.value = false
}
</script>

<template>
    <div 
        class="
            box
            comp-panel grow
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
                    theme-surface2 font-text -semibold
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
    border-radius: 10px;
}
textarea {
    padding: var(--padding-closed);
    border: none;
    border-radius: 10px;
    resize: none;
    height: calc(1rem + (2 * var(--padding-closed)));
    transition: 300ms ease;
}
textarea.active,
textarea:focus {
    height: calc(15rem + (2 * var(--padding-open)));
    padding: var(--padding-open);
    transition: 300ms ease;
}
textarea:focus {
    outline: 1px solid white;
}
</style>