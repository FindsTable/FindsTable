<script setup lang="ts">
import { PagesSettingsTabsAccountAvatarFrame as Frame } from '#components'
import type { PropType } from 'vue'

const me = useUserState()
const selectedAvatar = ref<any>(null)

const props = defineProps({
  avatars: {
    type: Array as PropType<Array<{ id: string; image: string }>>,
    required: true
  }
})

const emit = defineEmits<{
  (e: 'refreshAvatarCollection'): void
}>()

function showToaster(ok: boolean) {
    const message = 
        ok
        ? 'Your avatar was deleted with success !'
        : 'An error occured and we could ne delete your avatar !'

    useToaster(
        'show',
        {
            id: 'deleting-avatar',
            message: message,
            type: ok ? 'success' : 'error',
            autoClose: true,
            position: 'bottom'
        }
    )
}

async function deleteSelectedAvatar() {

  if (!selectedAvatar.value) return
  const tempSelectedAvatar = selectedAvatar.value

  const res = await $fetch(
        `/api/content/deleteItem`,
        {
            method: 'DELETE',
            headers: {
                authorization: `Bearer ${useUserState().value.accessToken.value}`
            },
            body: {
                collection: 'Avatars',
                id: selectedAvatar.value.id
            }
        }
    )

    if(res.ok) {
        showToaster(true)
    } else {
        showToaster(false)
    }

    emit('refreshAvatarCollection')
}

async function setAsCurrentAvatar() {
  if (!selectedAvatar.value) return

  useDirectAsyncFetch(
    'PATCH', `/users/me`,
    {
        body: {
            avatar: selectedAvatar.value.image, // default avatar field is linked to the file
            currentAvatar: {
                id: selectedAvatar.value.id, // selectedAvatar is linked to the Avatars item
                currentAt: Date.now()
            }
        },
        onResponse: () => {
            showToaster(true)
            emit('refreshAvatarCollection')
        },
        onResponseError: () => {
            showToaster(true)
        }
    }
  )

  function showToaster(  ok : boolean) {
    const message =
        ok
        ? 'You avatar was update with great success !'
        : 'A problem stopped us from setting this avatar as you current one.'
    useToaster('show', {
        id: 'newAvatar',
        type: 'success',
        autoClose: true,
        message: message,
        position: 'bottom'
    })
  }
}

function handleSelectAvatar(av: { id: string; image: string }) {
  if (selectedAvatar.value?.id === av.id) {
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
        v-for="av in avatars" 
        :key="av.id"
        @click="handleSelectAvatar(av)"
        :imageUrl="`${useAppConfig().directusUrl}/assets/${av.image}`"
        :class="[selectedAvatar?.id === av.id ? 'selected' : '']"
      />
    </div>
  </div>

  <div class="flex marTop20">
    <button 
        v-if="avatars"
        @click="setAsCurrentAvatar"
        :disabled="!selectedAvatar || selectedAvatar.id === me.avatar"
        class="comp-button -text font-text-main"
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
