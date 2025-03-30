<script setup>

async function saveNewFind() {

    const res = await useNuxtApp().$items.create({
        collection: 'Finds',
        body: {
            title: "This is a test 2.",
            metals: [
                { Metals_id: "iron" }
            ]
        },
        query: {
            fields: 'id,owner,metals.*'
        }
    })

    console.log(res.data)
}


definePageMeta({
    title: 'New Find',
    description: 'Add a new find to your collection',
    middleware: 'private-route',
});
</script>

<template>
    <NuxtLayout name="private-route">
        <template #title>
            Add a new find
        </template>

        <template #header>

        </template>

        <template #noScrollMain>

        </template>

        <template #scrollMain>
            <button class="comp-button -filled pointer" @click="saveNewFind">
                SUBMIT
            </button>
            <LazyPagesFindsNewFormMain />
        </template>
    </NuxtLayout>
    
</template>