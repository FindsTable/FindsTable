<script setup>
const props = defineProps({
    huntReports: Array
})
const emit = defineEmits(['getNextPage'])

function getNextPage() {
    emit('getNextPage')
}

// async function deleteThought(thoughtId) {
//     const { openModal } = useConfirmationModal()
//     const confirmDelete = await openModal({
//         title: "Delete permanently ?",
//         message: "your thought will be deleted permanently, this action is not reversible."
//     })

//     if (!confirmDelete) {
//         return
//     }
//     const res = await $fetch(
//         '/api/content/deleteItem',
//         {
//             method: 'DELETE',
//             headers: {
//                 authorization: `Bearer ${useUserState().value.accessToken.value}`
//             },
//             body: {
//                 collection: 'Thoughts',
//                 id: thoughtId
//             }
//         }
//     )

//     if(res?.ok) {
//         if(newThoughts.value.length) {
//             //filter new finds
//             newThoughts.value = newThoughts.value.filter(t => t.id !== thoughtId)
//         }
//         //emit to filter older finds
//         emit('thoughtDeleted', thoughtId)

//         useToaster('show',{
//             id: 'thought-deleted',
//             message: 'Thought deleted !',
//             type: 'success',
//             autoClose: true,
//             position: 'bottom'
//         })
//     }
// }
</script>

<template>
    <div v-if="huntReports" class="arch_scrollBottonPadding">
        <NuxtLink
            v-for="huntReport in huntReports" :key="huntReport.id" 
            :to="`/hunt-reports/${huntReport.id}`"
            class="pointer"
        >
            <article
                
                class="comp-panel -surface1 pad10"
            >
                <div class="bannerFrame centered">
                    <img 
                        :src="`https://admin.findstable.net/assets/${huntReport.banner}`" alt=""
                        class="banner objectFitContain"
                    >
                </div>
                

                <div class="flex column marTop10">
                    <TH1>
                        {{ huntReport.title }}
                    </TH1>
                    <Tp>
                        {{ useParseDate(new Date(huntReport.date))  }}
                    </Tp> 
                </div>

                <Tp class="marTop20">
                    {{ huntReport.content }}
                </Tp>

            </article>
        </NuxtLink>

        <div class="centered">
            <button 
                class="comp-button -filled marTop20 font-text -main"
                @click="getNextPage"
            >
                next page
            </button>
        </div>
    </div>
</template>

<style scoped>
.bannerFrame {
    height: 100px;
    width: 100%;
    overflow: hidden;
}
</style>