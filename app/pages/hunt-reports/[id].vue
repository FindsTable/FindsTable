<script setup lang="ts">
type huntReport = {
    id: string
    title: string
    content: string
    banner: string
    date: string
    owner: {
        id: string
        avatar: string
        username: string
        displayName: string
    }
    date_created: string
}

const route = useRoute()

const fields = [
    '*',
    'owner.avatar',
    'owner.id',
    'owner.displayName',
    'owner.username',
    'date_created'
]

const {
    response : huntReport,
    isPending,
    error,
    refresh,
    differedFetch
} = useDirectAsyncFetch<HuntReport>(
    'GET', `/items/Hunt_reports/${route.params.id}`,
    {
        differed: true,
        query: {
            fields: fields.join(',')
        }
    }
)

onMounted(() => {
    differedFetch()
})

definePageMeta({
    title: 'Hunt report from your log book',
    description: 'Finds Table, a place to show your share of history.',
    middleware: 'private-route'
});
</script>

<template>
    <NuxtLayout name="private-route">
        <template #tabs v-if="huntReport">
            <div class="bannerFrame centered">
                <img 
                    :src="`https://admin.findstable.net/assets/${huntReport.banner}`" alt=""
                    class="banner objectFitContain"
                >
            </div>
        </template>

        <template #title>
            <div v-if="huntReport">
                {{ huntReport.title }}
            </div>

            <div v-if="error">
                error: {{ error }}
            </div>

            <div v-if="isPending">
                LOADING ...
            </div>
        </template>

        <template #scrollMain>
            <article
                
                class="comp-panel  pad10"
            >
                <div class="flex column marTop10" v-if="huntReport">
                    <Tp>
                        {{ useParseDate(new Date(huntReport.date))  }}
                    </Tp> 
                </div>

                <Tp class="marTop20" v-if="huntReport">
                    {{ huntReport.content }}
                </Tp>

            </article>
        </template>
    </NuxtLayout>
</template>