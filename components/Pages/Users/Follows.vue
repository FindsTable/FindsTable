<script setup>
const props = defineProps({
    userId: String
})

const {
    response : follows
} = useDirectAsyncFetch(
    'GET', '/items/Follows',
    {
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
    }
)

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