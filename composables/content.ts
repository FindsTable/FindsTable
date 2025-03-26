export const useContent = () => {
    return useState<{      
        finds: Object[] | null,
        thoughts: Object[][] | null
    }>(
        'content',
        () => ({
            finds: null,
            thoughts: []
        })
    );
}