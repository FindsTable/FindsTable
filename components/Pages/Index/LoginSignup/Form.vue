<script setup>
import { LazyPagesIndexLoginSignupInputField as Input } from '#components'
import { validate } from '#shared/dataValidation/forms'
const { t } = useI18n();

const appState = useAppState()
const $users = useNuxtApp().$users

const formType = ref('login')

const invitationCode = ref('');
const username = ref({
    input: '',
    isUnique: false,
    processing: false,
    prefix: '@',
    prefixed: computed(() => {
        return `${username.value.prefix}${username.value.input}`
    }),
    timeout: null,
    checkIsUnique: async () => {
        if (formType.value === 'login') return
        clearTimeout(username.value.timeout)
        username.value.timeout = setTimeout(async () => {
            username.value.processing = true
            const res = await $fetch(
                '/api/auth/username-is-unique',    
                {
                    method: 'POST',
                    body: {
                        username: username.value.input
                    }
                }
            )
            username.value.isUnique = res.data
            username.value.processing = false
        }, 1000)
    }
})
const email = ref('')
const password = ref('')
const passwordConfirmation = ref('')

const passwordsAreIdentical = computed(() => {
    return password.value === passwordConfirmation.value
})

const formIsValid = computed(() => {
    // needs to be rewritten !!!
    validate.passwordLength(password.value)
    if(formType.value === 'login') {
        return validate.emailFormat(email.value) &&
            password.value.length
    } else if(formType.value === 'signup') {
        return validate.emailFormat(email.value) &&
            password.value.length &&
            passwordsAreIdentical.value
    }
})

async function handleSubmit() {
    appState.value.pending = true
    await submitMethods[formType.value]()
    appState.value.pending = false
}

const submitMethods = {
    login: async () => {

        const loginSuccess = await useLoginFlow(
            'emailAndPassword',
            {
                email: email.value,
                password: password.value
            }
        )

        if(loginSuccess) {
                useToaster('show', {
                id: 'loggedIn',
                messagePath: useWelcomeBackString(t) ,
                type: 'success',
                autoClose: true,
                position: 'bottom'
            })
            // navigateTo('/home/thoughts')
            navigateTo(useAppConfig().welcomeUrl)

        }
    },
    signup:  async () => {
        
        const res = await useHandleSignup({
            invitationCode: invitationCode.value,
            username: username.value.input, 
            email: email.value, 
            password: password.value,
            passwordConfirmation: passwordConfirmation.value
        })
        console.log('submitting', res)
        if(res.feedback) {
            console.log(res.feedback)
        }

        if(res.ok) navigateTo(`/redirection/new-account-created?email=${useAnonymizeEmail(email.value)}`)
    }
}


</script>

<template>
    <p class="font-pageLead">
        {{ t('page.landing.loginSignupInvitation') }}
    </p>
    <form 
        class="flex column gap20 marTop50"
    >

        <FormsTypeToggler :types="['login', 'signup']" v-model="formType" />

        <Input 
            v-if="formType === 'signup'"
            :id="useId()" 
            type="text" 
            name="invitationCode"
            placeholder_key="forms.userAccount.invitationCode.placeholder"
            label_key="forms.userAccount.invitationCode.label" 
            v-model="invitationCode"
        />
        <Input 
            v-if="formType === 'signup'"
            @input="username.checkIsUnique"
            @change="username.checkIsUnique"
            :id="useId()" 
            type="text" 
            name="username"
            placeholder_key="forms.userAccount.username.placeholder"
            label_key="forms.userAccount.username.label" 
            v-model="username.input"
        >
            <template #iconLeft>
                <div class="flex gap5">
                    <PagesIndexLoginSignupUserNameIcons 
                        :processing="username.processing"
                        :isUnique="username.isUnique"
                    />

                    <span>
                        {{ username.prefix }}
                    </span>
                </div>
            </template>
        </Input>

        <Input 
            :id="useId()" 
            type="email" 
            name="email"
            placeholder_key="forms.userAccount.email.placeholder"
            label_key="forms.userAccount.email.label" 
            v-model="email"
        />

        <Input
            :id="useId()" 
            type="password" 
            name="password"
            placeholder_key="forms.userAccount.password.placeholder"
            label_key="forms.userAccount.password.label" 
            v-model="password"
        />

        <Input
            v-if="formType === 'signup'"
            :id="useId()" 
            type="password" 
            name="password"
            placeholder_key="forms.userAccount.passwordConfirmation.placeholder"
            label_key="forms.userAccount.passwordConfirmation.label" 
            v-model="passwordConfirmation"
        />

        <button 
            @click.prevent="handleSubmit"
            class="
                relative
                comp-button 
                comp-button -filled
            "
            :class="[ appState.pending ?  'pending' : '']"
            :disabled="!formIsValid" 
        >
            {{ t('forms.buttons.submit') }}
            <UiButtonPendingOverlay />
        </button>
    </form>
</template>

<style scoped>
button {
    align-self: center;
    margin: 6px 0;
}
</style>