<script setup lang="ts">
import { 
    PagesSettingsTabsAccountAvatarFrame as Frame ,
    ArchitectureFramesAutoCropper as CanvasFrame
} from '#components'
import appConfig from '~/app.config';

interface Avatar {
    id: string;
    image: string;
    user: string;
    currentAt: number;
}

const { t } = useI18n()
const emit = defineEmits(['refreshAvatarCollection'])
const user = useUserState();
const $itemsWithFile = useNuxtApp().$itemsWithFile
const $items = useNuxtApp().$items
const { openModal } = useModal()

const inputField = ref<HTMLInputElement & {$el: any} | null>(null)
const canvasFrameRef = ref<InstanceType<typeof CanvasFrame> | null>(null)
const avatarUrl = ref<string>('');
const file = ref<File | null>(null);
const croppedFile = ref<File | null>(null);

function handleFile(selectedFile: File) {
    file.value = selectedFile;
    avatarUrl.value = URL.createObjectURL(selectedFile);
}

async function openImageInCropperModal() {
    const newFile = await openModal({
        component: 'cropper',
        data: avatarUrl.value,
        content: {
            title: 'Image Cropper',
            message: 'Please resize your avatar to fit in the red frame',
        }
    }) as File
    croppedFile.value = newFile as File
    avatarUrl.value = URL.createObjectURL(newFile)
}

interface NewFileObject {
    //based on the $itemsWithFile.create call
    id: string
    user: string
    currentAtt: number
    image: string
}

async function saveChanges() {
    if (!croppedFile.value) {

        if(canvasFrameRef.value) {
            croppedFile.value = await canvasFrameRef.value.createResizedImageFile()
        }
        if(!croppedFile.value) return
    }

    const res = await $itemsWithFile.create<NewFileObject>({
        collection: 'Avatars',
        item: {
            body: {
                user: user.value.id,
                currentAt: Date.now()
            },
            query: {
                fields: 'id,user,currentAt,image'
            }
        },
        file: croppedFile.value,
        user: user.value.id
    })

    if(res.data?.image) {
        await $items.update<{
            currentAt: number
            image: string
        }>({
            collection: 'Avatars',
            id: res.data.id,
            body: {
                currentAt: Date.now()
            },
            query: {
                fields: 'currentAt,image'
            }
        })

        user.value.avatar = res.data.image;
        emit('refreshAvatarCollection')
    }
}


</script>

<template>
    <div class="flex alignEnd gap20" v-if="inputField">
        <Frame
            @click.prevent.stop="inputField.$el.click()" 
            pointer
            icon="plus"
        >
            <template #image>
                <CanvasFrame
                    ref="canvasFrameRef"
                    :width="150"
                    :height="150"
                    :url="avatarUrl"
                />
            </template>
        </Frame>

        <button 
            v-if="file"
            class="comp-button -text"
            @click="openImageInCropperModal"
        >
            {{ t('page.settings.tabs.account.sections.avatar.sections.uploadNew.cropThisImage') }}
        </button>

        <button
            v-if="file"
                @click="saveChanges"
                class="comp-button -filled"    
            >
            {{ t('page.settings.tabs.account.sections.avatar.sections.uploadNew.saveButton') }}
        </button>
    </div>

    <div class="flex">
        <FormsInputFile 
            @newFile="handleFile"
            fileType="image"
            ref="inputField"
            label="forms.inputs.file.image.label"
            icon="addImage"
        />

        <FormsInputFile
            v-if="appConfig.device.hasCamera"
            @newFile="handleFile"
            label="forms.inputs.file.camera.label"
            icon="cameraFront"
            accept="image/*"
            capture="user"
        />
    </div>
</template>

<style scoped>

</style>