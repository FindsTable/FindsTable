<script setup>
import { PagesSettingsTabsAccountAvatarFrame as Frame } from '#components'
const user = useUserState()
</script>

<template>
    <div class="flex alignEnd gap20">
        <div class="avatarFrame centered relative" @click="inputField.$el.click()">
            <Icon 
                v-if="!user.avatar"
                name="account"
            />

            <Frame :imageUrl="`${useAppConfig().directusUrl}/assets/${user.avatar}`" v-else />
        </div>
    </div>
</template>

<style scoped>

</style>