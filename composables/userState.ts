import type { UserState } from '@/shared/types/state';


export const useUserState = () => {
    const userState =  useState<UserState>(
        'userState',
        () => ({
            isLoggedIn: false,
            avatar: '',
            username: '',
            displayName: '',
            email: '',
            id: '',
            accessToken: {
                value: '',
                expires_at: 0
            },
            personalDataRecord: {
                email: null,
                firstName: null,
                lastName: null,
                country: null
            },
            patreon_account: {
                id: '',
                first_name: '',
                full_name: '',
                email: '',
                thumb_url: '',
                url: '',
                tier: null,
                patron_status: '',
                access_token: '',
                expires_at: 0,
                token_type: '',
                refresh_token: ''
            }
        })
    );

    // watch(
    //     () => userState.value.accessToken?.value,
    //     (newToken, oldToken) => {
    //         console.log('Access token changed:');
            
    //         if (newToken && newToken !== oldToken) {
    //             useNuxtApp().$auth.ativateAccessTokenAutoRefresh()
    //             console.log('Refreshing token...');
    //         }
    //     }
    // );
    return userState
}





export function useClearUserState() {

    const userState = useUserState()

    userState.value = {
        isLoggedIn: false,
        avatar: '',
        username: '',
        displayName: '',
        email: '',
        id: '',
        accessToken: {
            value: '',
            expires_at: 0
        },
        personalDataRecord: {
            email: null,
            firstName: null,
            lastName: null,
            country: null
        },
        patreon_account: {
            id: '',
            first_name: '',
            full_name: '',
            email: '',
            thumb_url: '',
            url: '',
            tier: '',
            patron_status: '',
            access_token: '',
            expires_at: 0,
            token_type: '',
            refresh_token: ''
        }
    }

    // remove refresh token by setting the expiration date to the past
    document.cookie = 'directus_refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}


const personalDataObject = {
    value: "",
    key: "",
    user: "",
    id: ""
}