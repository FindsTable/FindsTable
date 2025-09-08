<script setup lang="ts">
const itemViewer = useItemViewerState()

const fieldString: {
    [key: string]: string
} = {
    Finds: '*, owner.username, owner.displayName',
    Hunt_reports: '*, owner.username, owner.displayName, finds.*',
    Thoughts: '*, owner.username, owner.displayName',
}

if (!itemViewer.value.item 
    && itemViewer.value.collection 
    && itemViewer.value.id
) {
    // If no item is provided, fetch it from Directus
    const {
        differedFetch,
        response,
        error,
        isPending
    } = useDirectAsyncFetch(
        'GET',
        `/items/${itemViewer.value.collection}/${itemViewer.value.id}`,
        {
            query: {
                fields: fieldString[itemViewer.value.collection]
            },
            differed: true
        }
    )
    await differedFetch()

    if(response.value?.data) {
        itemViewer.value.item = response.value
    }
}

function handleBack() {
    console.log('back')
    itemViewer.value.reset()
    console.log(itemViewer.value)
}
</script>

<template>
    <div
        v-if="itemViewer.visible" 
        class="
            itemViewer
            isolate absoluteFull
            theme-backdropColor
            flex column
        "
    >
        <div class="flex w100 gap10 mar10">
            <button 
                class="backButton pad10 pointer"
                @click.stop.prevent="handleBack"
            >
                <Icon 
                    name="back" 
                    class="theme-textColor-main"
                />
            </button>
        </div>

        <div 
            class="relative grow"
        >
            <div 
                class="h100 flex justifyCenter alignCenter"
            >
                <UiSpinner />
            </div>

            <div 
                class="absoluteFull"
            >
                <ContentFindsCardMedium
                    v-if="itemViewer.item"
                    :find="itemViewer.item"
                />

                <!-- <div
                    v-else-if="itemViewer.collection === 'Hunt_reports'"
                >
                </div>

                <div
                    v-else-if="itemViewer.collection === 'Thoughts'"
                >
                </div> -->
            </div>
        </div>


        

    </div>
</template>

<style scoped>
.itemViewer {
    z-index: 1;
}
</style>