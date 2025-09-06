<script setup lang="ts">
const props = defineProps<{
    userId: string,
    badgeKey: string
}>()

const {
    response : findsCount,
} = useDirectAsyncFetch(
    'GET', `/users/${props.userId}`,
    {
        query: {
            fields: 'finds_count'
        }
    }
)

const overlay = computed(() => {
    return findsCount.toString()
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