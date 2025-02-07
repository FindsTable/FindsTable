export interface User {
    isLoggedIn: boolean;
    avatarFileId: string | null;
    username: string | null;
    email: string | null;
    role: string | null;
    id: string | null;
    logout: () => void;
    accessToken: {
        value: string | null;
        expires_at: number;
        refresh: () => void;
        isExpired: (token : string) => void;
    };
    refreshToken: {
        value: string | null;
        expires_at: number;
        setCookie: (name: string, value: string, days: number) => void;

    };
}
