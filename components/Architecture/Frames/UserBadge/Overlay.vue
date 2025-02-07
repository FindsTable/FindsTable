<script setup lang="ts">
const userContent = useUserContent()
const $users = useNuxtApp().$users

const props = defineProps<{
    userId: string,
    badgeKey: string
}>()

async function getNumberOfFinds(userId: string): Promise<number> {
    if( 
        props.userId === useUserState().value.id &&
        userContent.value.badges.length
    ) {
        console.log("no need for fetching num of finds")
        return userContent.value.badges.length
    }
    
    const res = await $users.getById<{
        finds: {
            id: string
        }[]
    }>({
        id: userId,
        query: {
            fields: 'finds.id'
        }
    })

    return res.data?.finds.length || 0
}
const overlay = ref<string>('')

onMounted( async (): Promise<void> => {
    if(props.badgeKey === 'numberOfFinds') {
        const res = await getNumberOfFinds(props.userId)
        overlay.value = res.toString()
    }
})

</script>

<template>
    <div
        class="overlay absolute full centered">
        <span class="" v-if="overlay">
            {{ overlay }}
        </span>
    </div>
</template>

<style scoped>
.overlay {
    font-size: 50px;
    font-family: var(--typeface-findsTable);
    font-weight: 700;
    opacity: 0.8;
}
</style>