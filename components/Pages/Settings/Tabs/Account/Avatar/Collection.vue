<script setup>
import { PagesSettingsTabsAccountAvatarFrame as Frame } from '#components'

const { t } = useI18n()
const $items = useNuxtApp().$items
const user = useUserState();
const $files = useNuxtApp().$files

const selectedAvatar = ref(null)

const props = defineProps({
    avatars: Array
})
const emit = defineEmits([
    'refreshAvatarCollection'
])
async function deleteSelectedAvatar() {
    if(!selectedAvatar.value) return

    const res = await $files.deleteById(selectedAvatar.value.image)

    if(res.toaster) {
        //use toaster here in cas of an error
    }

    emit('refreshAvatarCollection')
}

async function setAsCurrentAvatar() {
    if(!selectedAvatar.value) return    
    
    const meRes = await useNuxtApp().$users.updateMe({
        body: {
            avatar: selectedAvatar.value.image,
            currentAvatar: {
                id: selectedAvatar.value.id,
                currentAt: Date.now()
            }
        },
        query: {
            fields: 'avatar,currentAvatar.*'
        }
    })
    console.log(meRes)
    if (meRes.ok && meRes.data) {
        console.log(meRes.data.currentAvatar)
        user.value.avatar = meRes.data.currentAvatar.image

        emit('refreshAvatarCollection')
        useToaster('show', {
            id: 'newAvatar',
            type: 'success',
            autoClose: true,
            messagePath: 'success.avatar.updated',
            position: 'bottom'
        })
    }
}

function handleSelectAvatar(av) {

    if(selectedAvatar.value?.id === av.id) {
        selectedAvatar.value = null
    } else {
        selectedAvatar.value = av
    }
}
</script>

<template>
    <div class="flex gap20 marTop20">
        <div v-if="avatars?.length" class="flex gap20">
            
            <Frame 
                pointer
                class="avatarFrame"
                v-for="av in avatars" :key="av.id"
                @click="handleSelectAvatar(av)"
                :imageUrl="`/api/assets/${av.image}`"
                :class="[selectedAvatar?.id === av.id ? 'selected' : '']"
        />
        </div>
    </div>

    <div class="flex marTop20" v-if="avatars">
        <button 
            @click="setAsCurrentAvatar"
            :disabled="!selectedAvatar || selectedAvatar.id === avatars[0].id"
            class="comp-button -text font-text-main"
            :class="[]"
            
        >
            select
        </button>

        <button 
            @click="deleteSelectedAvatar" 
            :disabled="!selectedAvatar"
            class="comp-button -text font-text-main"
        >
            delete
        </button>
    </div>
</template>

<style scoped>
.overlay {
    background-color: #000000b3;
}

.avatarFrame:first-child {
    outline: 4px solid rgb(55, 119, 55);
}

.avatarFrame:first-child.selected,
.selected {
    outline: 2px solid var(--tone-mango-50);
}
</style>