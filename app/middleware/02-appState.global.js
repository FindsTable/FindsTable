export default defineNuxtRouteMiddleware(async (to, from) => {
    const itemViewer = useItemViewerState()
    const itemViewerQuery = to.query['itemViewer']

    if(itemViewer.value.visible) {
        if(!itemViewerQuery) {
            itemViewer.value.reset()
        } else {
            return
        }
    }

    if(itemViewerQuery) {
        if(!itemViewer.value.visible) {
            const newQuery = { ...to.query }

            delete newQuery['itemViewer']
            
            const res = await navigateTo({
                path: to.path,
                query: newQuery
            }, { replace: true })

            return res
        }
    }
    return
})