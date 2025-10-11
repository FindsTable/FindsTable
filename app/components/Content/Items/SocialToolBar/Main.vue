<script setup>
const props = defineProps({
    collection: String,
    itemId: String
})
const emit = defineEmits(['likeClick', 'commentClick'])

</script>

<template>
    <div
        class="box flex justifyEvenly w100"
    >
        
        <div class="centered grow ">
            <ContentItemsSocialToolBarLikes
                :itemId="itemId"
                :collection="collection"
            />
        </div>

        <div class="centered grow">
            <ContentItemsSocialToolBarComments
                @click.stop.prevent="emit('commentClick')"
                :itemId="itemId"
                :collection="collection"
                :clickable="true"
            />
        </div>

        <div class="centered grow">
            <ContentItemsSocialToolBarBookmark
                :itemId="itemId"
                :collection="collection"
            />
        </div>
    </div>
</template>

<style scoped>
.box {
    padding: 5px 0;
}
.grow {
    width: calc(100% / 3);
}
</style>