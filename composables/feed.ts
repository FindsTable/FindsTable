import { useStorage } from '@vueuse/core' // from VueUse

export {
    useFeed
}

async function useFeed(
    userId: string,
    collection: string,
    fields: string[]
    
) {
    const {
        buildCacheKeyToday,
        buildIncrementedCacheKey,
        saveToLocalCache,
        getFromLocalCache,
        getAllCacheChunksForType
    } = useLocalCache(userId)

    const isPending = ref(false)
    const itemType = collection.toLowerCase()

    const cacheKey_today = buildCacheKeyToday(itemType)
    const localCache_today = useStorage<any[]>(cacheKey_today, [])

    const {
        cacheChunks_data,
        cacheChunks_keys,
        lastDateCreatedSeen
    } = readCache(userId, itemType)

    const currentCacheChunk_index = ref<number>(1) //start at 1 to skip today's chunk

    const items = useState<any[]>(`items-${itemType}`, () => [])
    let tempCache_today = [
        ...localCache_today.value
    ]
    const followingCacheItems = ref<any[]>([])
    
    const feed = computed(() => {

        const array =  Array.from(
            new Map([
                ...items.value,
                ...tempCache_today,
                ...followingCacheItems.value
            ].map(item => [item.id, item]))
            .values()
        )
        console.log("feed in computed",array)
        return array
    })

    const ITEMS_PER_PAGE = 2
    const currentPage = ref(0)

    const queryFilters_and = ref<any>([])
    const queryFilters_or = ref<any>([])

    if(lastDateCreatedSeen.value) {
        queryFilters_or.value.push({
            date_created: {
                _gt: lastDateCreatedSeen.value
            }
        })
        queryFilters_or.value.push({
            date_updated: {
                _gt: lastDateCreatedSeen.value
            }
        })
    }

    const query  = computed(() => {
        return {
            filter: {
                _and: queryFilters_and.value,
                _or: queryFilters_or.value
            },
            fields,
            sort: "-date_lastEvent",
            limit: ITEMS_PER_PAGE,
            offset: currentPage.value * ITEMS_PER_PAGE
        }
    })
    
    // in tiems, remember the last index seen
    const lastSeenIndex = useState<number>(
        `lastSeen-${itemType}`, 
        () => 0
    )

    async function getNextPage() {
        if(isPending.value) return
        isPending.value = true

        const newItems = await useGetItems({
            collection,
            query: query.value
        })

        console.log('new items fetched', newItems)

        if(newItems.length) {
            items.value = [
                ...items.value,
                ...newItems
            ]

            // localCache_today.value = {
            //     ...newItems,
            //     ...localCache_today.value
            // }
            currentPage.value++
        } 
        
        else if(
            cacheChunks_keys.value.length &&
            currentCacheChunk_index.value < cacheChunks_keys.value.length
        ) {
            const nextCacheChunk_key = cacheChunks_keys.value[currentCacheChunk_index.value]

            if (!nextCacheChunk_key) {
                isPending.value = false
                return
            }
            const nextCaheChunk_items = getFromLocalCache<any[]>(nextCacheChunk_key)

            if (nextCaheChunk_items?.length) {

                console.log('getting items from cache')
                items.value = [
                    ...items.value,
                    ...nextCaheChunk_items
                ]
                currentCacheChunk_index.value++
            }

        }

        
        isPending.value = false
    }

    function removeItem(itemId: string) {
        items.value = items.value.filter(f => f.id !== itemId);
        tempCache_today = tempCache_today.filter(f => f.id !== itemId);
        followingCacheItems.value = followingCacheItems.value.filter(f => f.id !== itemId);
    }


    return {
        items,
        feed,
        localCache_today,
        removeItem,
        getNextPage
    }
}

interface Query {
    filter: {
        _and: any[]
    },
    fields: string[]
    sort: string
    limit: number
    offset: number
}

function readCache(userId : string, itemType : string) {
    const {
        getAllCacheChunksForType
    } = useLocalCache(userId)

    const cacheChunks_data : CacheChunks = getAllCacheChunksForType(itemType)
    const cacheChunks_keys = ref<string[]>([])
    const lastDateCreatedSeen = ref<any>(null)

    if(cacheChunks_data.size)  {
        const firstEntry = cacheChunks_data.entries().next().value
        if (firstEntry != null) {
            lastDateCreatedSeen.value = firstEntry[1].date_to
            cacheChunks_keys.value = [...cacheChunks_data.keys()]
        }
    }

    return {
        cacheChunks_data,
        cacheChunks_keys,
        lastDateCreatedSeen
    }
}