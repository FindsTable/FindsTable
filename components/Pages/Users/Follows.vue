<script setup>
const props = defineProps({
    userId: String
})

const follows = ref(null)

async function getFollows() {
    const res = await useNuxtApp().$items.getByQuery({
        collection: 'Follows',
        query: {
            filter: {
                _or: [
                    {
                        follower: {
                            _eq: props.userId
                        }
                    },
                    {
                        followed: {
                            _eq: props.userId
                        }
                    },
                ]
            }
        }
    })

    if(res?.data) {
        follows.value = res.data
    }    
}

onMounted(() => {
    getFollows()
})

const followers = computed(() => {
    if(!follows?.value) return 0

    const f = follows.value.filter(f => f.followed === props.userId)

    return f.length
})

const followings = computed(() => {
    if (!follows?.value ) return 0

    const f = follows.value.filter(f => f.follower === props.userId)

    return f.length
})
</script>

<template>
    <div class="flex gap20">
        <div class="flex gap5" >
            <p>
                {{ followers }}
            </p>

            <p>
                followers
            </p>
        </div>

        <div class="flex gap5" >
            <p>
                {{ followings }}
            </p>

            <p>
                following
            </p>
        </div>
    </div>
</template>