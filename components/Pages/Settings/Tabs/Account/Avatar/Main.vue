<script setup>
import {
    ArchitecturePageSectionsH2Panel as H2Panel,
    PagesSettingsTabsAccountAvatarSelectNew as SelectNewAvatar,
    PagesSettingsTabsAccountAvatarCollection as Collection,
} from '#components'

const { t } = useI18n()

const user = useUserState();
const userContent = useUserContent()

const {
    response : avatars,
    refresh : refreshAvatars
} = useDirectAsyncFetch(
    'GET', '/items/Avatars',
    {
        query: {
            fields: 'image,id,currentAt',
            filter: {
                owner: {
                    _eq: user.value.id
                }
            },
            sort: '-currentAt'
        },
        onResponse: () => {
            if (Array.isArray(avatars.value) && avatars.value.length > 0) {
                selectedButton.value = avatars.value.length ? 'collection' : 'uploadNew'
                user.value.avatar = avatars.value[0].image
                userContent.value.avatars = avatars.value
            }
        }
    }
)

const selectedButton = ref('');

async function refreshAvatarCollection() {
    await refreshAvatars()

    if(!avatars.value.length) {
        selectedButton.value = 'uploadNew'
    } else {
        selectedButton.value = 'collection'
    }
}

</script>

<template>
    <H2Panel>
        <template #H2>
            {{ t('page.settings.tabs.account.sections.avatar.title') }}
        </template>

        <template #content>
            <div class="flex gap10">
                <button 
                    v-if="avatars?.length"
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