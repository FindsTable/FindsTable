<script setup>

const appConfig = useAppConfig()
const { t } = useI18n()
const colorModeCookie = useCookie('colorMode')

function handleToggle(setting) {
    if (appConfig.colorMode.setting === setting) {
        return
    }

    if (setting === 'auto') {
        appConfig.colorMode.active = appConfig.colorMode.browser
    } else {
        appConfig.colorMode.active = setting
    }

    colorModeCookie.value = setting
    appConfig.colorMode.setting = setting
    useToaster(
        'show',
        {
            id: "colorModeToggler",
            messagePath: `${t('success.colorMode.changedTo')} ${t(`colorMode.modes.${setting}`)}`,
            type: "success",
            autoClose: true,
            position: "bottom"
        }
    )
}
</script>

<template>
    <div v-if="useAppConfig().colorMode.setting" class="togglerBox flex gap10">
        <button 
            v-for="mode in useAppConfig().colorModes" :key="mode.id" 
            @click="handleToggle(mode.id)"
            class="
                theme-mainActionButton
                pointer
            "
            :class="[
                useAppConfig().colorMode.setting === mode.id ? '-on' : '-off'
            ]"
        >

            <Icon :name="mode.icon" />
        </button>
    </div>
</template>

<style scoped>
.togglerBox {
    padding: 8px 0;
}
button {
    height: 36px;
    aspect-ratio: 1/1;
    padding: 6px;
    border-radius: 4px;
}

</style>