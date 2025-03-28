<script setup>
const user = useUserState().value

const linkUrl = "https://www.patreon.com/oauth2/authorize"

async function newStateToken() {
    const { data : res } = await useFetch(
        '/api/patreon/state-token',
        {
            method: 'POST',
            headers: {
                'authorization': 'Bearer ' + user.accessToken.value,
            },
            body: {
                newStateToken: true,
                userId: user.id
            },
            server: false
        }
    )

    if(!res.value.ok) {
        return undefined
    }
    return res.value.token
}

function setRedirectionUrl() {
    if (process.env.NODE_ENV === 'development') return "http://dev.findstable.net:3000/redirection/patreon/link-account"

    return "https://findstable.net/redirection/patreon/link-account"
}

async function handleClick() {
    const stateToken = await newStateToken()
    if(!stateToken) {
        return
    }

    const params = [
        "?response_type=code",
        `&client_id=${useRuntimeConfig().public.PATREON_FINDSTABLENET_CLIENT_ID}`,
        `&redirect_uri=${setRedirectionUrl()}`,
        `&state=${stateToken}`,
        '&scope=identity identity%5Bemail%5D identity.memberships'
    ]

    console.log(params.join(''))
    navigateTo(`${linkUrl}${params.join('')}`, { external: true })
}

</script>

<template>
    <button 
        @click.prevent="handleClick"
        class="
            theme-textColor-main
            comp-button
            comp-button-filled
        "
    >
        Link your patreon account
    </button>
</template>