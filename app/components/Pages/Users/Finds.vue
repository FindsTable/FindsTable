<script setup>
const props = defineProps({
    userId: String
})
const me = useUserState()
const finds = ref(null)

async function getFinds() {
    console.log('geting finds!!')
    const res = await $fetch(
        'https://admin.findstable.net/items/Finds',
        {
            method: 'GET',
            headers: {
                authorization: `Bearer ${me.value.accessToken.value}`
            },
            query: {
                fields: '*,images.*,owner.*,owner.avatars.*',
                filter: {
                    owner: {
                        _eq: props.userId
                    }
                },
                deep: {
                    owner: {
                        avatars: {
                            _sort: "-currentAt",
                            _limit: 1
                        }
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