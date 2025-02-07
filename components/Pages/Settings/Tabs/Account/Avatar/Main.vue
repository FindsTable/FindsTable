<script setup>
import {
    ArchitecturePageSectionsH2Panel as H2Panel,
    PagesSettingsTabsAccountAvatarSelectNew as SelectNewAvatar,
    PagesSettingsTabsAccountAvatarCollection as Collection,
} from '#components'

const { t } = useI18n()
const $items = useNuxtApp().$items
const $users = useNuxtApp().$users
const $files = useNuxtApp().$files

const user = useUserState();
const userContent = useUserContent()

const { data: avatars, refresh: refreshAvatars } = await useAsyncData(
    'avatarCollection',
    async () => {
        // if( userContent.value.fetched.avatars ) {
        //         console.log('wont refresh')
        //     avatars were previously fetched byt the lazyUserContent plugin
        //     return userContent.value.avatars
        // }

        const res = await $items.getByQuery({
            collection: 'Avatars',
            query: {
                fields: 'image,id,currentAt',
                filter: {
                    user: {
                        _eq: user.value.id
                    }
                },
                sort: '-currentAt'
            }
        })

        //useToaster and tips here

        if(res.data) {
            userContent.value.avatars = res.data
            return res.data
        }
        return []
        
    },
    {
        server: false
    }
)
const selectedButton = ref('');

function newAvatarAdded() {
    refreshAvatars()
    selectedButton.value = 'collection'
}
async function avatarDeleted() {
    await refreshAvatars()

    if(!avatars.value.length) {
        selectedButton.value = 'uploadNew'
    }
    
}
async function refreshAvatarCollection() {
    await refreshAvatars()

    if(!avatars.value.length) {
        selectedButton.value = 'uploadNew'
    } else {
        selectedButton.value = 'collection'
    }
}
onMounted(() => {
    selectedButton.value = avatars.value.length ? 'collection' : 'uploadNew'
})
</script>

<template>
    <H2Panel>
        <template #H2>
            {{ t('page.settings.tabs.account.sections.avatar.title') }}
        </template>

        <template #content>
            <div class="flex gap10">
                <button 
                    v-if="avatars.length"
                    @click.prevent="selectedButton = 'collection'"
                    class="comp-button -text"
                    :class="[ selectedButton === 'collection' ? 'selected' : '' ]"  
                >
                    {{ t('page.settings.tabs.account.sections.avatar.sections.myAvatars.button') }}
                </button>

                <button 
                    @click.prevent="selectedButton = 'uploadNew'"
                    class="comp-button -text"
                    :class="[ selectedButton === 'uploadNew' ? 'selected' : '' ]"  
                >
                    {{ t('page.settings.tabs.account.sections.avatar.sections.uploadNew.button') }}
                </button>
            </div>

            <Collection 
                v-if="selectedButton === 'collection'"
                :avatars="avatars"
                @refreshAvatarCollection="refreshAvatarCollection"
            />

            <SelectNewAvatar 
                v-if="selectedButton === 'uploadNew'"
                @refreshAvatarCollection="refreshAvatarCollection"
            />
        </template>
    </H2Panel>
</template>