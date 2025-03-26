export const useCache = () => {
    return useState<{
        //holds the item data when navigating from homepage to item's page.
        itemCache : Object | null,       
        finds: Object[] | null
    }>(
        'cache',
        () => ({
            itemCache : null,
            finds: null
        })
    );
}