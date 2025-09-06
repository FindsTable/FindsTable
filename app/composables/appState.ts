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
        layoutState: {
            mainContentFlow: 'community' | 'user'
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
            layoutState: {
                mainContentFlow: 'community'
            }
        })
    );
}