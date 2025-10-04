export default defineNuxtRouteMiddleware(async (to, from) => {
    const user = useUserState()
    
    if (user.value.isLoggedIn) {
        console.log("user is already logged in")
        return
    }

    await useRefresh()

    if (user.value.isLoggedIn) {
        // return navigateTo(useAppConfig().value.welcomeUrl)
        return navigateTo(useAppConfig().welcomeUrl)
    }
    return
})

