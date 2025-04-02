<script setup>
const props = defineProps({
    userId: String
})
const me = useUserState()
const finds = ref(null)

async function getFinds() {
    const res = await $fetch(
        'https://admin.findstable.net/items/Finds',
        {
            method: 'GET',
            headers: {
                authorization: `Bearer ${me.value.accessToken.value}`
            },
            query: {
                fields: '*,images.*',
                filter: {
                    owner: {
                        _eq: props.userId
                    }
                }
            }
        }
    )
 
    return res.data
}
onMounted( async () => {
    finds.value = await getFinds()
})
</script>

<template>
    <ContentFindsMain :finds="finds" class="r">
        <template #albumSelector>
            <ContentFindsAlbumSelector :albums="albums" />
        </template>
    </ContentFindsMain>
</template>