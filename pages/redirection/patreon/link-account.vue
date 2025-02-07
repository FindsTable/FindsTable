<script setup>
const { t } = useI18n()
const route = useRoute()
const user = useUserState()

const patreonState = route.query.state
const patreonCode = route.query.code

async function linkAccount() {

    const res = await $fetch(
        '/api/patreon/account/link',
        {
            method: 'POST',
            headers: {
                'authorization': 'Bearer ' + user.value.accessToken.value
            },
            body: {
                state: patreonState, //state token to validate the orperation
                code: patreonCode, //code from patreon to get access tokens
                userId: user.value.id
            },
            server: false
        }
    )

    return res
}

onMounted(async () => {
    useAppState().value.pending = true

    const userState_patreon = await linkAccount()

    if(!userState_patreon?.ok) {
        console.log('There was a problem while linking your account')
    } 

    if(userState_patreon.ok) {
        console.log('seems ok')
        const userState_patreon = await useNuxtApp().$patreon.getPatreonAccountFromDirectus()
        
        if(userState_patreon) {
            console.log('patreon account:', userState_patreon)
            useLoadStateData('userState', {
                patreon: userState_patreon
            })
        }
    }
    
    useAppState().value.pending = false

    useToaster('show', {
        id: 'accountLinked',
        // messagePath: t(userState_patreon.feedback.message),
        messagePath: '',
        // type: userState_patreon.feedback.type,
        autoClose: true,
        position: 'bottom'
    })

    navigateTo('/home')
})

definePageMeta({
    middleware: 'private-route',
})

</script>

<template>

    <NuxtLayout name="private-route">

        <h1 class="font-h1">
            patreon link account confirmation
        </h1>

        <div class="h1">
            we are processing your request.
        </div>
    </NuxtLayout>



</template>