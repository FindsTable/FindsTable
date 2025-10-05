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
                expires: 0
            },
            personalDataRecord: {
                email: null,
                firstName: null,
                lastName: null,
                country: null
            },
            patreon_account: null
        })
    );
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
            expires: 0
        },
        personalDataRecord: {
            email: null,
            firstName: null,
            lastName: null,
            country: null
        },
        patreon_account: null
    }

    // remove refresh token by setting the expiration date to the past
    document.cookie = 'findstable_refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}