export {
    useCache,
    useSetCacheData,
    useIsCacheDataValid,
    useSetCacheInLocalStorage,
    useGetCachedData,
    useClearLocalStorageCache
}

export type {
    CacheKey
}

const cacheTTL = {
  finds: 600_000,     // 10 min
  thoughts: 300_000,  // 5 min
  users: 600_000,
  badges: 999_999_999_999 // "never" expire
}

const useCache = () => {
  return useState<
    Record<'itemCache', object | null> & Record<CacheKey, CacheEntry>
  >('cache', () => ({
    //itemCache hold an item to make it accessible when navigationg to it's dedicated page
    itemCache: null,
    finds: { timestamp: 0, ttl: cacheTTL.finds, data: undefined },
    thoughts: { timestamp: 0, ttl: cacheTTL.thoughts, data: undefined },
    users: { timestamp: 0, ttl: cacheTTL.users, data: undefined },
    badges: { timestamp: 0, ttl: cacheTTL.badges, data: undefined }
  }))
}

function useSetCacheData(cacheKey: CacheKey, data: any) {
  const now = Date.now()
  const ttl = cacheTTL[cacheKey]

  useCache().value[cacheKey] = {
    data,
    ttl,
    timestamp: now
  }

  useSetCacheInLocalStorage(cacheKey, data)
}

function useIsCacheDataValid(cacheKey: CacheKey): boolean {
  const now = Date.now()
  const ttl = cacheTTL[cacheKey]

  // Check useCache first
  const memoryEntry = useCache().value[cacheKey]
  const isMemoryFresh = now - memoryEntry.timestamp < memoryEntry.ttl
  const hasMemoryData =
    memoryEntry.data !== undefined &&
    memoryEntry.data !== null &&
    (!Array.isArray(memoryEntry.data) || memoryEntry.data.length > 0)

  if (isMemoryFresh && hasMemoryData) {
    return true
  }

  // Fallback to localStorage
  const raw = localStorage.getItem(cacheKey)
  if (raw) {
    try {
      const entry: CacheEntry = JSON.parse(raw)
      const isLocalFresh = now - entry.timestamp < entry.ttl
      const hasLocalData =
        entry.data !== undefined &&
        entry.data !== null &&
        (!Array.isArray(entry.data) || entry.data.length > 0)

      return isLocalFresh && hasLocalData
    } catch (e) {
      console.warn(`[useIsCacheDataValid] Invalid localStorage cache for "${cacheKey}"`, e)
    }
  }

  return false
}

function useSetCacheInLocalStorage(cacheKey: CacheKey, data: any) {
  const ttl = cacheTTL[cacheKey]
  const now = Date.now()

//   try {
//     const existing = localStorage.getItem(cacheKey)
//     if (existing) {
//       const parsed: CacheEntry = JSON.parse(existing)
//       const isExpired = now - parsed.timestamp > parsed.ttl
//       if (!isExpired) return
//     }
//   } catch (e) {
//     console.warn(`[useSetCacheInLocalStorage] Corrupted cache for "${cacheKey}"`, e)
//     localStorage.removeItem(cacheKey)
//   }

  const newEntry: CacheEntry = {
    data,
    ttl,
    timestamp: now
  }

  localStorage.setItem(cacheKey, JSON.stringify(newEntry))
}

function useGetCachedData(cacheKey: CacheKey): any | undefined {
  const ttl = cacheTTL[cacheKey]
  const now = Date.now()

  const memoryEntry = useCache().value[cacheKey]
  const memoryIsFresh = now - memoryEntry.timestamp < memoryEntry.ttl
  const memoryHasData =
    memoryEntry.data !== undefined &&
    memoryEntry.data !== null &&
    (!Array.isArray(memoryEntry.data) || memoryEntry.data.length > 0)

  if (memoryIsFresh && memoryHasData) {
    return memoryEntry.data
  }

  const raw = localStorage.getItem(cacheKey)
  if (raw) {
    try {
      const localEntry: CacheEntry = JSON.parse(raw)
      const localIsFresh = now - localEntry.timestamp < localEntry.ttl
      const localHasData =
        localEntry.data !== undefined &&
        localEntry.data !== null &&
        (!Array.isArray(localEntry.data) || localEntry.data.length > 0)

      if (localIsFresh && localHasData) {
        useCache().value[cacheKey] = localEntry
        return localEntry.data
      }
    } catch (e) {
      console.warn(`[useGetCachedData] Failed to parse localStorage for "${cacheKey}"`, e)
    }
  }

  return undefined
}

function useClearLocalStorageCache(cacheKey: CacheKey) {
  localStorage.removeItem(cacheKey)
}

interface CacheEntry {
  timestamp: number
  ttl: number
  data: any
}

type CacheKey = 'finds' | 'thoughts' | 'users' | 'badges'
