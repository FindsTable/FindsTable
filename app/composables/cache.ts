export {
    useNewCache
}

interface CacheEntry<T> {
  value: T;
  timestamp: number;
}

function useNewCache(
    ttl: number = 5 * 60 * 1000,
    cleanupInterval?: number
) {

  const cacheMap = new Map<string, CacheEntry<any>>();
  let intervalId: NodeJS.Timeout | undefined;

  const cleanup = () => {
    const now = Date.now();
        for (const [key, entry] of cacheMap.entries()) {
            if (now - entry.timestamp > ttl) {
                cacheMap.delete(key);
            }
    }
  };

  if (cleanupInterval) {
    intervalId = setInterval(cleanup, cleanupInterval);
  }

  return {
    set(key: string, value: any): void {
      cacheMap.set(key, {
        value,
        timestamp: Date.now()
      });
    },

    get(key: string): any | undefined {
      const entry = cacheMap.get(key);

      if (!entry) {
        return undefined;
      }

      const isExpired = Date.now() - entry.timestamp > ttl;

      if (isExpired) {
        cacheMap.delete(key);
        return undefined;
      }

      return entry.value;
    },

    has(key: string): boolean {
      const entry = cacheMap.get(key);

      if (!entry) {
        return false;
      }

      const isExpired = Date.now() - entry.timestamp > ttl;

      if (isExpired) {
        cacheMap.delete(key);
        return false;
      }

      return true;
    },

    delete(key: string): void {
      cacheMap.delete(key);
    },

    clear(): void {
      cacheMap.clear();
    },
    destroy(): void {
      if (intervalId) {
        clearInterval(intervalId);
      }

      this.clear();
    }
  };
}