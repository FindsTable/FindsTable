<script setup>
const props = defineProps({
    userId: String
})

const fields = [
    '*',
    'owner.avatar',
    'owner.id',
    'owner.displayName',
    'owner.username',
    'date_created',
    'likes.*'
]

const {data : thoughts } = await useAsyncData(
    'myThoughts',
    async () => {
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
                    sort: "-date_created"
                }
            }
        )
        return res.data
    }
)

function removeThought(id) {
    const index = thoughts.value.findIndex(thought => thought.id === id)
    console.log('removing thought',thoughts.value)

    if (index !== -1) {
         thoughts.value = thoughts.value.filter(thought => thought.id !== id)
    }
    console.log('removing thought',thoughts.value)
}

const ref_ContentThoughtsMain = ref(null)

function handleNewThoughtPosted(newThought) {
    ref_ContentThoughtsMain.value.newThoughtPosted(newThought)
}

</script>

<template>
    <ArchitectureAppStructureBoxesMainElement>
        <ContentThoughtsNew 
            @newThoughtPosted="handleNewThoughtPosted"
        />
    </ArchitectureAppStructureBoxesMainElement>

    <ContentThoughtsMain 
        v-if="thoughts"
        :thoughts="thoughts"
        @thoughtDeleted="removeThought"
        ref="ref_ContentThoughtsMain"
    />
</template>