export default defineNuxtPlugin((nuxtApp) => {

    nuxtApp.hooks.hook('app:mounted', async () => {

        useAppConfig().device.hasCamera = await checkIfDeviceForCamera()

        if(useUserState().value.isLoggedIn) {
            useNuxtApp().$auth.ativateAccessTokenAutoRefresh()
        }
    });
});



async function checkIfDeviceForCamera() {
    let hasCamera = false
    if (!navigator.mediaDevices) {
        const ua = navigator.userAgent

        if (/android/i.test(ua)) { // check if user agent is an android
            console.log('Android device detected');
            hasCamera = true
        }
        else if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) { // window.MSStream for IE11 and olded Edge compatibility
            console.log('iOS device detected');

            hasCamera = true
        }
    } else {
        navigator.mediaDevices.enumerateDevices()
            .then(function (devices) {
                const videoDevices = devices.filter(device => device.kind === 'videoinput')
                if (videoDevices.length > 0) {
                    hasCamera = true
                }
            })
    }
    return hasCamera
}