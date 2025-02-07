export function useLoadStateData(
    store: 'userState' | 'appState',
    data: any
) {

    const targetStore = useState(store, () => data)

    targetStore.value = {
        ...targetStore.value,
        ...data
    }

}
