// --------------------------------------------------
// Manages cache for app content 
// (badges, badges_variations, weather tags, biomes) 
// based on the App_manifest from Directus
//
//  Content is stored in Directus, 
//  but kept in local cache for optimizaiton.
//--------------------------------------------------------------------------------------------------------------------

export {
    useFTApp,
    useAppContent,
    findInLocalState
}

export type {
    FTBadge         // DEPRECATING
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
type AppContentCollection = Badge | BadgeVariation

function useFTApp() {
    const appContent = useState<Record<string, AppContentCollection[]>>(
        'ftAppPayload', 
        () => reactive({})
    );
    const _versions = ref<Record<string, FrontEndCacheEntries['version']>>({});

    //---------------------------------------------------
    // App content is saved in localStorage.
    //  - Verify the data type version ( cache vs App_manifest )
    //  - Refresh if needed
    //---------------------------------------------------
    async function initiateAppContent() {
        Object.assign(_versions.value, ls
            .getData<Record<string, FrontEndCacheEntries['version']>>(LS_KEY_VERSIONS) || {}
        );

        const { directFetch } = useDirectAsyncFetch();

        const { response : manifest } = await directFetch<AppManifest>(
            'GET', '/items/App_manifest',
            {
                query: {
                    fields: [
                        'cache_entries.id',
                        'cache_entries.collection',
                        'cache_entries.version',
                        'cache_entries.key',
                        'cache_entries.query'
                    ].join(',')
                }
            }
        );

        if(!manifest) return  // NEED TO HANDLE FALLBACK SOLUTION

        // 3️⃣  Iterate over each bucket in the manifest.
        for (const entry of manifest.cache_entries) {

            const { 
                version, 
                collection, 
                key, 
                query 
            } = entry;

            appContent.value[key] = ls.getData<any[]>(storageKey(key)) || [];

            if (
                // true
                !_versions.value[key] ||
                !appContent.value[key].length ||
                _versions.value[key] !== version
            ) {

                const parsedQuery = query ? JSON.parse(query) : {};

                const { response : items } = await directFetch<AppContentCollection[]>(
                    'GET', `/items/${collection}`,
                    {
                        query: parsedQuery
                    }
                );

                appContent.value[key] = items ? items : []
                _versions.value[key] = version;

                ls.setData(storageKey(key), items);
            }
        }

        // Save versions to localstorage
        ls.setData(LS_KEY_VERSIONS, _versions.value);

        useAppContent().value = appContent.value;
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

    function getBadge(key: BadgeKey): FTBadge | undefined {
        return _badges.value.find(badge => badge.key === key);
    }

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
// Local types
//--------------------------------------------------------------------------------------------------------------------

type FTBadge = Badge<{
    variations: BadgeVariation[];
    default: BadgeVariation;
}>

