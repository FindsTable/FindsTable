export default defineNuxtRouteMiddleware(async (to, from) => {
    const user = useUserState()
    if (user.isLoggedIn) {
        return
    }
    const logingSuccess = await useLoginFlow('refreshTokenCookie')

    if (logingSuccess) {
        return
    }

    if (user.value.isLoggedIn) {
        return
    }
    return navigateTo('/')
})
