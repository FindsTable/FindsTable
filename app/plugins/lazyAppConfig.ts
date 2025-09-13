export default defineNuxtPlugin((nuxtApp) => {

    nuxtApp.hooks.hook('app:mounted', async () => {
        
        // Test cookie functionality first
        // const cookiesWork = await testCookieFunctionality()
        // useAppConfig().cookiesEnabled = cookiesWork

        useAppConfig().device.hasCamera = await checkIfDeviceForCamera()

        if(useUserState().value.isLoggedIn) {
            useNuxtApp().$auth.ativateAccessTokenAutoRefresh()
        }
    });
});

async function testCookieFunctionality(): Promise<boolean> {
    try {
        const results: Record<string, boolean> = {}
        
        // First try server-side cookies
        const response = await useFetch('/api/app/cookie-test')
        await new Promise(resolve => setTimeout(resolve, 100))
        
        // Check server-set cookies
        let cookies = document.cookie.split(';')
        results.server_dot = !!cookies.find(c => c.trim().startsWith('server_test_dot='))
        results.server_nodot = !!cookies.find(c => c.trim().startsWith('server_test_nodot='))
        
        // Set client-side cookies
        const now = new Date()
        const expires = new Date(now.getTime() + 60000).toUTCString()
        
        // Set cookie with dot domain
        document.cookie = `client_test_dot=test_value; expires=${expires}; path=/; domain=.findstable.net; secure`
        
        // Set cookie without dot domain
        document.cookie = `client_test_nodot=test_value; expires=${expires}; path=/; domain=findstable.net; secure`
        
        // Wait a moment and check all cookies
        await new Promise(resolve => setTimeout(resolve, 100))
        cookies = document.cookie.split(';')
        
        // Check client-set cookies
        results.client_dot = !!cookies.find(c => c.trim().startsWith('client_test_dot='))
        results.client_nodot = !!cookies.find(c => c.trim().startsWith('client_test_nodot='))
        
        // Log detailed results
        console.log('Cookie test results:')
        console.log('Server-set cookie with dot domain (.findstable.net):', results.server_dot)
        console.log('Server-set cookie without dot domain (findstable.net):', results.server_nodot)
        console.log('Client-set cookie with dot domain (.findstable.net):', results.client_dot)
        console.log('Client-set cookie without dot domain (findstable.net):', results.client_nodot)
        console.log('All current cookies:', document.cookie)
        
        // Return true if any cookie method worked
        return Object.values(results).some(result => result)
    } catch (error) {
        console.error('Cookie test failed:', error)
        return false
    }
}



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