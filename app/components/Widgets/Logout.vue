<script setup>
async function handleClick() {
    const appState = useAppState().value

    appState.pending = true

    await useNuxtApp().$auth.logout()

    appState.pending = false
}
</script>

<template>
    <button class="flex alignCenter pointer theme-textColor-main">
        <Icon name="logout" @click="handleClick" />
    </button>
</template>

<style scoped>

</style>