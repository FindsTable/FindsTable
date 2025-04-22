// --------------------------------------------------
// Manages cache for app content based on the App_manifest from Directus
//--------------------------------------------------------------------------------------------------------------------

export {
    useFTApp,
    useAppContent,
    findInLocalState
}

export type {
    FTBadge
}

const useAppContent = () => {
    return useState<Record<string, any>>(
        'appContent',
        () => ({})
    );
}

function findInLocalState<ItemType>(
    storeKey: string,
    collection: string,
    callback: (item: ItemType) => boolean
): ItemType | undefined {
    const store = useState<Record<string, any>>(storeKey, () => ({}));
    const content = store.value[collection] as ItemType[] | undefined;

    if (!Array.isArray(content)) {
      return undefined;
    }
  
    return content.find(callback);
}

//--------------------------------------------------------------------------------------------------------------------
// CONSTANTS  –  all localStorage keys derive from a single namespace so we can
//               rename / migrate without touching Directus data.
//--------------------------------------------------------------------------------------------------------------------
    const NAMESPACE                         = 'ftApp'
    const LS_KEY_VERSIONS                   = `${NAMESPACE}::versions` // key for the list of cached versions
    const LS_PREFIX_PAYLOAD                 = `${NAMESPACE}::payload::`  // + badges/images/etc

//--------------------------------------------------------------------------------------------------------------------
// LOCALSTORAGE WRAPPER – only available  client side
//--------------------------------------------------------------------------------------------------------------------


const local_storage = typeof window !== 'undefined' ? window.localStorage : null

const ls = {
    /** returns null on SSR or malformed JSON. */
    getData<T = unknown>(key: string): T | null {
        if (!local_storage) return null
        try { return JSON.parse(local_storage.getItem(key) || 'null') as T } catch { return null }
    },
    /**aborts on SSR. */
    setData(key: string, value: unknown) {
        if (!local_storage) return
        local_storage.setItem(key, JSON.stringify(value))
    }
}

/** Build the payload key for a given cacheKey (e.g. "badges"). */
const storageKey = (cacheKey: string) => { 
    return `${LS_PREFIX_PAYLOAD}${cacheKey}` 
}



function useFTApp() {
    const appContent = useState<Record<string, any[]>>(
        'ftAppPayload', 
        () => reactive({})
    );
    const _versions = ref<Record<string, number>>({});

    //---------------------------------------------------
    // App content is saved in localStorage.
    //  - Verify the data type version ( cache vs App_manifest )
    //  - Refresh if needed
    //---------------------------------------------------
    async function initiateAppContent() {
        Object.assign(_versions.value, ls.getData<Record<string, number>>(LS_KEY_VERSIONS) || {});
        const { directFetch } = useDirectAsyncFetch();

        const {
            response : manifest
        } = await directFetch<Manifest>(
            'GET', '/items/App_manifest',
            {
                query: {
                    fields: [
                        '*',
                        'cache_entries.version',
                        'cache_entries.collection',
                        'cache_entries.key',
                        'cache_entries.query',
                        'cache_entries.id'
                    ].join(',')
                }
            }
        );

        console.log('manifest', manifest);

        // 3️⃣  Iterate over each bucket in the manifest.
        for (const entry of manifest.cache_entries) {
            const { version, collection, key, query } = entry;

            appContent.value[key] = ls.getData<any[]>(storageKey(key)) || [];

            // console.log("appContent", appContent.value);
            // console.log("badges", appContent.value[key].length);
            // console.log(_versions.value[key]);
            // console.log("query", query)
            if (
                // true
                !_versions.value[key] ||
                !appContent.value[key].length ||
                _versions.value[key] !== version
            ) {
                // console.log('need to refetch payload');

                const parsedQuery = query ? JSON.parse(query) : {};

                const { 
                    response : items
                } = await directFetch(
                    'GET', `/items/${collection}`,
                    {
                        query: parsedQuery
                    }
                );

                appContent.value[key] = items;
                _versions.value[key] = version;
                // console.log("appContent", appContent.value);
                // console.log(_versions.value[key]);

                ls.setData(storageKey(key), items);
            }
        }

        // 4️⃣  Persist the version & timestamp tables (cheap, unconditional).
        ls.setData(LS_KEY_VERSIONS, _versions.value);

        useAppContent().value = appContent.value;
        console.log(useAppContent().value)
    }

    // --------------------------------------------------
    // BADGES  – typed helpers for the first bucket (key="badges").
    // --------------------------------------------------
    const _badges = computed<FTBadge[]>(() => {
        return (appContent.value['badges'] ?? []) as FTBadge[];
    });

    function getAllBadges(): FTBadge[] {
        return _badges.value;
    }

    const allBadges = ref<FTBadge[]>(_badges.value);

    function getBadge(id: string | number): FTBadge | undefined {
        return _badges.value.find(badge => badge.id === id);
    }

    // console.log('app content loaded from cache', appContent.value);

    // --------------------------------------------------
    // PUBLIC API (returned object)
    // --------------------------------------------------
    return {
        // lifecycle
        initiateAppContent,

        // badges bucket
        getAllBadges,
        allBadges,
        getBadge,

        // refs debugging
        payload: appContent,
        versions: _versions
    }
}

//--------------------------------------------------------------------------------------------------------------------
// TYPES – extend as you add more buckets.
//--------------------------------------------------------------------------------------------------------------------

type FTBadge = {
    key: number | string
    variations: {
        badgeLevel: string,
        image: string
    },

    [k: string]: unknown
}

type CacheEntry = {
    collection: string
    key: string
    version: number
    query?: string
    ttl?: number | null
}

type Manifest = {
    cache_entries: CacheEntry[];
    version_app: string | null;
    version_badges: string;
}
