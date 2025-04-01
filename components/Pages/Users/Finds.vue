<script setup>
const props = defineProps({
    userId: String
})
const finds = ref(null)

function getFinds() {
    const res = $fetch(
        'https://admin.findstable.net/items/Finds',
        {
            method: 'GET',
            headers: {
                authorization: `Bearer ${useUserState().accessToken.value}`
            },
            query: {
                fields: '*',
                filter: {
                    
                }
            }
        }
    )
}
</script>

<template>
    <ContentFindsMain :finds="finds" />
</template>