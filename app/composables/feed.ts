export {
    useFeed
}

async function useFeed<
    CollName extends DirectusCollection,
    ItemType
>(
    collection:  DirectusCollection,
    fieldsArray: string[]
): Promise<{
    feed: ComputedRef<ItemType[]>;
    removeItem: RemoveItem;
    getNextPage: GetNextPage;
}> {
    const isPending = ref<boolean>(false)

    const items = useState<any[]>(`items-${collection.toLowerCase()}`, () => [])

    const feed = computed<ItemType[]>(() => {
        const array =  Array.from(
            new Map([
                ...items.value,
            ].map(item => [item.id, item]))
            .values()
        )
        return array
    })

    const ITEMS_PER_PAGE = 10
    const currentPage = ref(0)

    const queryFilters_and = ref<any>([])
    const queryFilters_or = ref<any>([])

    const query  = computed(() => {
        
        return {
            filter: {
                _and: queryFilters_and.value,
                _or: queryFilters_or.value
            },
            fields: fieldsArray.join(','),
            sort: "-date_lastEvent",
            limit: ITEMS_PER_PAGE,
            offset: currentPage.value * ITEMS_PER_PAGE
        }
    })

    async function getNextPage() {
        if(isPending.value) return
        isPending.value = true

        const newItems = await useGetItems({
            collection,
            query: query.value
        })

        if(newItems.length) {
            items.value = [
                ...items.value,
                ...newItems
            ]

            currentPage.value++
        } 
        
        isPending.value = false
    }

    function removeItem(itemId: string) {
        items.value = items.value.filter(f => f.id !== itemId);
    }


    return {
        feed,
        removeItem,
        getNextPage
    }
};

type RemoveItem = (itemId: string) => void
type GetNextPage = () => void
