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
    console.log(res)

    return res
}

onMounted(async () => {
    useAppState().value.pending = true
    
    try {
        const patreon_account = await linkAccount()
        
        user.value.patreon_account = patreon_account

        useToaster('show', {
            id: 'accountLinked',
            message: t('success.patreon.account.linked'),
            type: 'success',
            autoClose: true,
            position: 'bottom'
        })

    } catch(err) {
        useHandleError(err)
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

        <div class="h1">
            we are processing your request.
        </div>
    </NuxtLayout>



</template>