<script setup>
const props = defineProps({
    userId: String
})

const requestOffset = ref(0)
const requestLimit = ref(5)

const huntReports = ref([])

const fields = [
    '*',
    'owner.avatar',
    'owner.id',
    'owner.displayName',
    'owner.username'
]

async function getHuntReports() {
    const res = await $fetch(
        'https://admin.findstable.net/items/Hunt_reports',
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
    console.log(res)

    if (res?.data) {
        return res.data
    }

}

async function getNextPage() {
    requestOffset.value+= requestLimit.value
    const res = await getHuntReports()
    huntReports.value = [
        ...huntReports.value,
        ...res
    ]
}

onMounted(async () => {
    const res = await getHuntReports()
    
    huntReports.value = [
        ...huntReports.value,
        ...res
    ]
})

</script>

<template>
    <ContentHuntReportsMain
        v-if="huntReports"
        :huntReports="huntReports"
    />
</template>

<style scoped>


</style>