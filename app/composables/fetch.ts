export {
    dbGet,
    cacheDbGet
}

const cache = useNewCache(
    5 * 60 * 1000,
    20 * 60 * 1000
)

async function dbGet<T>(
  path: string,
  query?: Record<string, any>
): Promise<T> {
    const token = useUserState().value.accessToken.value;

    const response = await $fetch<{data: T}>(
        `https://admin.findstable.net${path}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            },
            query
        }
    );

    return response.data;
}

function generateCacheKey(path: string, query?: Record<string, any>): string {
  if (!query) return path;
  
  // Sort keys alphabetically for consistent cache keys
  const sortedQuery = Object.keys(query)
    .sort()
    .reduce((acc, key) => {
      acc[key] = query[key];
      return acc;
    }, {} as Record<string, any>);
  
  return `${path}_${JSON.stringify(sortedQuery)}`;
}


/*
*
*
*   Fetch and cache data
*   
*   the data is cached and shared across all components using the same fetch request
* 
*/

function cacheDbGet<T>(
    cacheKey: string,
    path: string,
    query?: Record<string, any>
) {
    const key = cacheKey || generateCacheKey(path, query);

    // Check cache first
    if (cache.has(key)) {
        const cachedValue = cache.get(key);
        
        // If cached value has error, retry in background
        if (cachedValue.error.value !== null) {
            const existingRefs = cachedValue;
            
            //
            // If the cache contains an error (from a previous fetch)
            // we return the refs to this new caller and run the fetch request in the background.
            // if this new caller gets lucky, all other components will be updated
            //
            const token = useUserState().value.accessToken.value;
            
            $fetch<{data: T}>(
                `https://admin.findstable.net${path}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    query
                }
            )
            .then(response => {
                existingRefs.data.value = response.data;
                existingRefs.error.value = null;
                existingRefs.pending.value = false;
            })
            .catch(err => {
                existingRefs.error.value = err;
                existingRefs.pending.value = false;
            });

            return existingRefs;
        }
        
        // Return cached success
        return cachedValue;
    }

    // No cache - create refs and fetch
    const data = ref<T | null>(null);
    const error = ref<Error | null>(null);
    const pending = ref(true);

    const token = useUserState().value.accessToken.value;

    function fetchData() {
        pending.value = true;
        error.value = null;

        return $fetch<{data: T}>(
            `https://admin.findstable.net${path}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                query
            }
        )
        .then(response => {
            data.value = response.data;
            pending.value = false;
        })
        .catch(err => {
            error.value = err;
            pending.value = false;
        });
    };

    fetchData();

    const refresh = () => {
        fetchData();
    };

    const result = { data, error, pending, refresh };
    
    cache.set(key, result);

    return result;
}