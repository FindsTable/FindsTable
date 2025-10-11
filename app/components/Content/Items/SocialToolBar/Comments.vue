<script setup>
const props = defineProps({
    collection: String,
    itemId: String,
    clickable: {
        type: Boolean,
        default: true
    },
})

const { data: comments } = cacheDbGet(
    `comments:${props.collection}:${props.itemId}`,
    `/items/${props.collection}_comments`,
    {
        fields: '*',
        filter: {
            item: {
                _eq: props.itemId
            }
        }
    }
)
</script>

<template>
    <button
        class="touch flex alignCenter justifyCenter gap5"
        :class="[
            clickable ? 'pointer' : 'defaultCursor'
        ]"
    >
        <Icon name="chat" :size="iconSize" />

        <span 
            v-if="comments?.length"
            :style="{
                fontSize: props.fontSize
            }"
            class="count"
        >
            {{ comments.length ? comments.length  : '' }}
        </span>
    </button>
</template>

<style scoped>
.count {
    font-weight: 600;
}
.touch {
    background-color: transparent;
        color: var(--textButton-textColor);
    padding: 5px;
    border-radius: 5px;
}
.touch:hover {
    background-color: rgba(128, 128, 128, 0.468);
}
</style>