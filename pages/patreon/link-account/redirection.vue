<script setup>
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
        const res = await useNuxtApp().$patreon.getPatreonAccountFromDirectus()
        console.log("patreon a ccount fromi directus",res)
        useLoadStateData('userState', {
            patreon: userState_patreon.data
        })
    }
    
    useAppState().value.pending = false

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

        <div class="font-pageLead">
            we are processing your request, your Patreon account will no longer be linked to your Finds Table account.
        </div>
    </NuxtLayout>



</template>