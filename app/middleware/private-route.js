export default defineNuxtRouteMiddleware(async (to, from) => {

    const user = useUserState()
    
    if (user.value.isLoggedIn) {
        return
    }

    await useRefresh()

    if (user.value.isLoggedIn) {
        return
    }
    return navigateTo('/')
})
