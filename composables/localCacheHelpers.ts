//UNUSED FOR NOW

export {
    useLocalCache
}
export type {
    CacheChunks
}

function useLocalCache(userId : string) {

    const CACHE_KEY = {
        prefix: 'ft',
        user: userId.slice(0, 8),
        // (() => {
        //     try {
        //         return useUserState().value?.id?.slice(0, 8)
        //     } catch (err) {
        //         console.warn('[Cache] Failed to get user ID for CACHE_KEY:', err)
        //         return undefined
        //     }
        // })()
        today: Math.floor(Date.now() / 86_400_000)
    }

    function buildIncrementedCacheKey( 
        itemType: string,
        incrementedId : number
    ): string {
        if (!CACHE_KEY.user) {
            throw new Error('[Cache] Cannot build cache key: user is not defined')
        }
        return `${CACHE_KEY.prefix}_${CACHE_KEY.user}_${itemType}_${incrementedId}`
    }
    
    function buildCacheKeyToday( itemType: string): string {
        if (!CACHE_KEY.user) {
            throw new Error('[Cache] Cannot build cache key: user is not defined')
        }
        return `${CACHE_KEY.prefix}_${CACHE_KEY.user}_${itemType}_${(CACHE_KEY.today)}`
    }
    
    function saveToLocalCache(itemType : string, data: any): void {
        if (!CACHE_KEY.user) return
      
        const fullKey = buildCacheKeyToday(itemType)
        try {
            const json = JSON.stringify(data)
            localStorage.setItem(fullKey, json)
        } catch (err) {
            console.warn(`[Cache] Failed to save ${fullKey}`, err)
        }
    }
    
    function getFromLocalCache<T>(fullKey : string): T | null {
        try {
            const raw = localStorage.getItem(fullKey)
            return raw ? JSON.parse(raw) as T : null
        } catch (err) {
            console.warn(`[Cache] Failed to load ${fullKey}:`, err)
            return null
        }
    }
    
    function getAllCacheChunksForType( type: string ): CacheChunks {
        const prefix = `${CACHE_KEY.prefix}_${CACHE_KEY.user}_${type}_`
    
        const dayMap = new Map<CacheChunkKey, CacheChunkValue>()
    
        Object.keys(localStorage)
            .filter(key => key.startsWith(prefix))
            .sort((a, b) => b.localeCompare(a)) // optional: sort newest-first
            .forEach(key => {
                const dayKey = key.replace(prefix, '')
                const data = getFromLocalCache<any[]>(key)
    
                if (data?.length) {
                    dayMap.set(key, {
                        date_from: data[data.length - 1].date_lastEvent,
                        // date_to: data[0][getLastSeenDate(data[0])],
                        date_to: data[0].date_lastEvent,
                        count: data.length
                    })
                }
            })
    
        return dayMap
    }

    function getLastSeenDate(item: any): string {
        /* 
        * item might be fetched because it was updated so we need the
        * latest date between the two to prevent refetching
        */ 
        return new Date(item.date_updated) > new Date(item.date_created)
            ? "date_updated"
            : "date_created"
    }

    return {
        buildCacheKeyToday,
        buildIncrementedCacheKey,
        saveToLocalCache,
        getFromLocalCache,
        getAllCacheChunksForType
    }
}





type CacheChunks = Map<CacheChunkKey, CacheChunkValue>
type CacheChunkKey = string
type CacheChunkValue ={
    date_from: string,
    date_to: string,
    count: number
}