export const useCache = () => {
    return useState<{
        navigation: any
    }>(
        'cacheState',
        () => ({
            navigation: undefined
        })
    );
}