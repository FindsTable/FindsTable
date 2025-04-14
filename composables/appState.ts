export const useAppState = () => {
    return useState<{
        internetConnection: boolean
        showSideBar: boolean
        fullScreen: boolean
        modal: {
            visible: boolean
            name: string
            data: any
        }
        pending: boolean
        patreon: {
            campaign: {
                tiers: any[]
            }
        },
        findViewer: {
            active: boolean,
            cardSize: 'image' | 'small' | 'medium' | 'large'
        }
    }>(
        'appState',
        () => ({
            internetConnection: true,
            showSideBar: false,
            fullScreen: false,
            modal: {
                visible: false,
                name: '',
                data: null,
            },
            pending: false,
            patreon: {
                campaign: {
                    tiers: [],
                }
            },
            findViewer: {
                active: false,
                cardSize: 'small'
            }
        })
    );
}

//Check on the route to activate route based settings

export function useActivateRouteWatcher() {
    const appState = useAppState()
    const route = useRoute()

    const handleRouteChange = () => {
        if(route.fullPath.includes('content=finds')) {
            appState.value.findViewer.active = true
        } else {
            appState.value.findViewer.active = false
        }
    }

    handleRouteChange()

    watch(() => route.fullPath, handleRouteChange)
}