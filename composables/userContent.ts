export const useUserContent = () => {
    return useState<{
        constentRecordId: string
        avatars: any[]
        finds: any[]
        badges: any[]
        badgeRecord: undefined | BadgeRecord
        notifications: any[]
        fetched: {
            avatars: boolean
            finds: boolean
            badges: boolean
            badgeRecord: boolean
        }
    }>(
        'userContent',
        () => ({
            constentRecordId: '',
            avatars: [],
            finds: [],
            badges: [],
            badgeRecord: undefined,
            notifications: [],
            fetched: {
                avatars: false,
                finds: false,
                badges: false,
                badgeRecord: false
            }
        })
    );
}