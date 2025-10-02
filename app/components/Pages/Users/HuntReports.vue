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

    if (res?.data) {
        return res.data
    }
}

function removeDeletedHuntReport(id) {
    const index = huntReports.value.findIndex(report => report.id === id)

    if (index !== -1) {
        huntReports.value.splice(index, 1)
    }
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
    <ArchitectureAppStructureBoxesMainElement>
        <LazyAppPromotionMediaHuntreportNewBanner />
    </ArchitectureAppStructureBoxesMainElement>
    
    <ContentHuntReportsMain
        v-if="huntReports"
        :huntReports="huntReports"
        :communityContent="false"
        @removeDeletedHuntReport="removeDeletedHuntReport"
    />
</template>