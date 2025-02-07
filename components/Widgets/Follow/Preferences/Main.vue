<script setup>
import { ArchitectureFramesAvatar as AvFrame } from '#components'
const { t } = useI18n() 
const { cancel } = useModal()

/*
The prop is called data because this component is used in the ComponentViewer modal.
This modal uses the <component> tag to render the component, and the prop is passed as "data"
to be compatible with all components.

*/
const props = defineProps({
    data: {
        user: {
            id: String,
            username: String,
            avatarUrl: String
        },
        follow: {
            id: String
        }
    }
})

</script>

<template>
    <div class="container w100">
        <div class="flex justifyBetween alignCenter pointer">
            <p>
                {{ t('activity.social.follow.preferences.title') }}
            </p>

            <button @click.stop.prevent="cancel()">
                <Icon name="close" size="2rem" class="theme-textColor-main" />
            </button>
        </div>

        <div class="flex alignCenter gap20 marTop20">
            <AvFrame v-if="props.data.user.avatarUrl" :fileUrl="props.data.user.avatarUrl" width="30px" round />

            <p>
                {{ props.data.user.username }}
            </p>
        </div>
        <div class="flex column marTop20 alignStart">
            <WidgetsFollowPreferencesStopFollowing :user="props.data.user" :follow="props.data.follow" />
        </div>
    </div>
</template>

<style scoped>
.container {
    padding: 20px;
    padding-top: 0px;
}
</style>