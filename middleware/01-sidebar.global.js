export default defineNuxtRouteMiddleware(async (to, from) => {
    const appState = useAppState()

    if (appState.value.showSideBar) {
        appState.value.showSideBar = false
    }
})