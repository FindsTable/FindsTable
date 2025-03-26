export const useContent = () => {
    return useState<{      
        finds: Object[] | null,
        thoughts: Object[] | null,
        users: Object[] | null
    }>(
        'content',
        () => ({
            finds: null,
            thoughts: [],
            users: []
        })
    );
}