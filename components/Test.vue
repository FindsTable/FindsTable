<script setup>
const userState = useUserState();

const { data } = await useFetch('/api/assets/Invitation_codes', { server: false} )

</script>

<template>
    <p class="mainTC" v-if="data">
        user token:
        {{ userState.accessToken }}

        hello
        data: {{ data }}
    </p>

    <a href="/api/items/Memberships" class="mainTC">Membershipt</a>

    <!-- <img src="/api/assets/3b4d6fd2-d173-45f5-9b9d-9bf0519ce4a9" alt=""> -->
</template>