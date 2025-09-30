<script setup>
const props = defineProps({
    userId: String
})

const requestOffset = ref(0)
const requestLimit = ref(5)

const thoughts = ref([])

const fields = [
    '*',
    'owner.avatar',
    'owner.id',
    'owner.displayName',
    'owner.username',
    'date_created',
    'likes.*'
]

async function getThoughts() {
    const res = await $fetch(
        'https://admin.findstable.net/items/Thoughts',
        {
            method: "GET",
            headers: {
                authorization: `Bearer ${useUserState().value.accessToken.value}`
            },
            query: {
                fields: fields.join(','),
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
                },
                sort: "-date_created",
                offset: requestOffset.value,
                limit: requestLimit.value
            }
        }
    )

    if (res?.data) {
        return res.data
    }

}

async function getNextPage() {
    requestOffset.value+= requestLimit.value
    const res = await getThoughts()
    thoughts.value = [
        ...thoughts.value,
        ...res
    ]
}

onMounted(async () => {
    const res = await getThoughts()
    
    thoughts.value = [
        ...thoughts.value,
        ...res
    ]
})

</script>

<template>
    <ContentThoughtsMain 
        v-if="thoughts"
        :thoughts="thoughts"
    />
</template>

<style scoped>


</style>