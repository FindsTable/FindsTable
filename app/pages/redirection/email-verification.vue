<script setup>

const { t } = useI18n()
const route = useRoute()

const emailState = ref('verifying')

async function verifyEmail() {
    console.log('eric')

    try {
        const res = await $fetch(
            '/api/auth/verify-email',
            {
                method: 'POST',
                body: {
                    email: route.query.email,
                    token: route.query.token
                }
            }
        )
        console.log('verifying email:', res)

        useToaster('show', {
            id: 'newUser',
            type: 'success',
            autoClose: true,
            message: "Welcome to the Finds Table !",
            position: 'bottom'
        })

        navigateTo("/login")
    } catch(err) {
        useHandleError(err)
    }
}

onMounted(() => {
    console.log('errrjrke')
    verifyEmail()
})

</script>

<template>
    <NuxtLayout name="public-route">
        <div class="theme-textColor-main">
            <h1 class="font-h1">
                {{ t('page.redirection.emailVerification.title') }}
            </h1>

            <p      
                v-if="emailState === 'verifying'"
                class="font-text" 
            >
                {{ t('page.redirection.emailVerification.verifying') }}
            </p>

            <div v-if="emailState === 'verified'">
                <p class="font-text">
                    {{ t('page.redirection.emailVerification.verified') }}
                </p>

                <div class="flex centered">
                    <NuxtLink to="/login" class="comp-button -filled">
                        {{ t('page.redirection.emailVerification.toLogin') }}
                    </NuxtLink>
                </div>
            </div>

            <div v-if="emailState === 'notVerified'">
                {{ t('page.redirection.emailVerification.notVerified') }}
            </div>
        </div>
    </NuxtLayout>
</template>

<style scoped>

</style>