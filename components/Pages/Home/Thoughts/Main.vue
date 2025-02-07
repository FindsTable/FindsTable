<script setup>

const { data :  thoughts, refresh } = await useAsyncData(
    'thoughts',
    async () => {
        const res = await useNuxtApp().$items.getByQuery({
            collection: 'Thoughts',
            query: {
                fields: '*,user_created.avatars.*,user_created.id,user_created.displayName,user_created.username,date_created',
                deep: {
                    user_created: {
                        avatars: {
                            _sort: "-currentAt",
                            _limit: 1
                        }
                    }
                }
            }
        })
        if(res?.data) {
            return res.data
        }
    }
)

function newThoughtPosted(newThought) {
    // two possible options: refrech the request with no rerender, or 
    // add the new item and trigger a full rerender...

    //unshift in and rerender
    // thoughts.value = [newThought, ...thoughts.value]
    //refresh and update the dom
    refresh()
}

</script>

<template>
    <PagesHomeThoughtsNew 
        @newThoughtPosted="newThoughtPosted"
    />

    <div v-if="thoughts">
        <div
            v-for="thought in thoughts" :key="thought.id" 
        >

            <PagesHomeThoughtsThought :thought="thought" @thoughtDeleted="thoughtDeleted" />
        </div>
    </div>
</template>

<style scoped>


</style>