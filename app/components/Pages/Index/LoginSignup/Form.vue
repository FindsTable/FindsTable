<script setup>
import { LazyPagesIndexLoginSignupInputField as Input } from '#components'

const {
    usernameIsPending,
    usernameIsUnique,
    validateUsername
} = usernameValidation()

async function handleUsernameInput() {
    await validateUsername(username.value)
}
const { t } = useI18n();

const formType = ref('login')

const invitationCode = ref('394cadcb-a9ff-47e9-a7fb-07303432fd72');
const username = ref('Posoroko')

const email = ref('posoroko@gmail.com')
const password = ref('1234')
const passwordConfirmation = ref('1234')

const formIsValid = computed(() => {
    if(formType.value === 'login') {
        return (
            emailFormatIsValid(email.value) 

        )
    }
    if(formType.value === 'signup') {
        return (
            invitationCode.value &&
            emailFormatIsValid(email.value) &&
            areStrongEqual(password.value, passwordConfirmation.value) &&
            username.value &&
            usernameIsUnique.value
        )
    }
})
const isPending = ref(false)

async function handleSubmit() {
    if(isPending.value) return

    isPending.value = true
    await submitMethods[formType.value]()
    
}

const submitMethods = {
    login: async () => {
        await useLogin(email.value, password.value)
        isPending.value = false
    },
    signup:  async () => {
        await useHandleSignup({
            invitationCode: invitationCode.value,
            username: username.value,
            email: email.value, 
            password: password.value,
            passwordConfirmation: passwordConfirmation.value
        })

        isPending.value = false
    }
}

</script>

<template>
    <p class="font-pageLead">
        {{ t('page.landing.loginSignupInvitation') }}
    </p>
    <form 
        class="flex column gap20 marTop50 comp-panel  pad20"
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
            @input="handleUsernameInput"
            @change="handleUsernameInput"
            :id="useId()" 
            type="text" 
            name="username"
            placeholder_key="forms.userAccount.username.placeholder"
            label_key="forms.userAccount.username.label" 
            v-model="username"
        >
            <template #iconLeft>
                <div class="flex gap5">
                    <PagesIndexLoginSignupUserNameIcons 
                        :processing="usernameIsPending"
                        :isUnique="usernameIsUnique"
                    />

                    <span>
                        @
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
                theme-mainActionButton
            "
            :class="[ isPending ?  'disabled' : '']"
            :disabled="!formIsValid || isPending"
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