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
    if(!follows.value) return null

    const f = follows.value.filter(f => f.followed === props.userId)

    return f.length
})

const followings = computed(() => {
    if (!follows.value) return null

    const f = follows.value.filter(f => f.follower === props.userId)

    return f.length
})
</script>

<template>
    <div class="flex gap20">
        <div class="" v-if="followers">
            <p>
                {{ followers }}
            </p>

            <p>
                followers
            </p>
        </div>

        <div class="" v-if="followings">
            <p>
                {{ followings }}
            </p>

            <p>
                following
            </p>
        </div>
    </div>
</template>