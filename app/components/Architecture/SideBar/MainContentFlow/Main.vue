<script setup>
const { t } = useI18n()
const route = useRoute()

const user = useUserState()
const appState = useAppState()

function handleClick(target) {
    appState.value.layoutState.mainContentFlow = target
}

onMounted(() => {
    const fullPath = route.fullPath

    if(fullPath.includes('/home?content')) {
        appState.value.layoutState.mainContentFlow = 'community'
        return
    }
    if(fullPath.includes('/users/')) {
        appState.value.layoutState.mainContentFlow = 'user'
        return
    }

    appState.value.layoutState.mainContentFlow = ''
})
</script>

<template>
    <div class="flex w100">
        <ArchitectureSideBarMainContentFlowButton
            to="/home?content=finds"
            @click.prevent="handleClick('community')"
            :selected="appState?.layoutState?.mainContentFlow === 'community'"
        >
            <template #text>
                {{ t("sideBarLinks.community") }}
            </template>

            <template #icon>
                <Icon
                    class="marTop5"
                    name="global"
                    size="30px"
                />
            </template>
        </ArchitectureSideBarMainContentFlowButton>

        <ArchitectureSideBarMainContentFlowButton
            :to="`/users/${user.id}`"
            @click.prevent="handleClick('user')"
            :selected="appState?.layoutState?.mainContentFlow === 'user'"
        >
            <template #text>
                {{ useUserState().value.username }}
            </template>

            <template #icon>
                <ArchitectureFramesAvatar 
                    :file-id="useUserState().value.avatar"
                    round
                    width="30px"
                />
            </template>
        </ArchitectureSideBarMainContentFlowButton>
    </div>
</template>