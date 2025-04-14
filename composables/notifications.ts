import { useStorage } from '@vueuse/core' // from VueUse

export  {
    useNotifications
}

const useNotifications = ( userId : string ) => {

    const notifications = useStorage<LocalNotification[]>('findsTable_notifications', [])
    const lastCheck = useStorage<number>('findsTable_lastNotifCheck', Date.now())

    const refreshNotifications = async () => {

        const since = new Date(lastCheck.value).toISOString()
        const now = Date.now()

        const [
            findsLikes,
            // findsComments, // <-- Uncomment when ready
            thoughtsLikes,
            thoughtsComments,
            follows,
            // newUsers // <-- If you want to notify admins about new users
        ] = await Promise.all([
            getFindsLikes(userId, since),
            getThoughtsLikes(userId, since),
            getThoughtsComments(userId, since),
            getFollows(userId, since)
        ])

        const newNotifs: LocalNotification[] = []

        for (const like of findsLikes) {
            newNotifs.push({
                type: 'like_find',
                action: "liked",
                content: "yourFind",
                user_from: like.user_created,
                user_for: like.item.owner,
                item: {
                    id: like.item.id,
                    thumbnail: like.item.images[0].directus_files_id,
                    toPath: `/finds/${like.item.id}`
                },
                date_created: like.date_created,
                isSeen: false
            })
        }

        for (const like of thoughtsLikes) {
            newNotifs.push({
                type: 'like_thought',
                action: "liked",
                content: "yourThought",
                user_from: like.user_created,
                user_for: like.item.owner,
                date_created: like.date_created,
                isSeen: false
            })
        }

        for (const comment of thoughtsComments) {
            newNotifs.push({
                type: 'comment_thought',
                action: "commented",
                content: "yourThought",
                user_from: comment.owner,
                user_for: comment.item.owner,
                date_created: comment.date_created,
                isSeen: false
            })
        }

        for (const follow of follows) {
            newNotifs.push({
                type: 'follow',
                action: "followingYou",
                content: "",
                user_from: follow.follower,
                user_for: follow.followed,
                date_created: follow.date_created,
                isSeen: false
            })
        }

        notifications.value = trimAndSort([
            ...notifications.value,
            ...newNotifs.filter(n => !alreadyExists(n, notifications.value))
        ])

        lastCheck.value = now
    }

    const markAllAsSeen = () => {
        notifications.value = notifications.value.map(n => ({ ...n, isSeen: true }))
    }

    const markOneAsSeen = (date_created: string) => {
        notifications.value = notifications.value.map(n =>
            n.date_created === date_created
            ? { ...n, isSeen: true }
            : n
        )
    }

    const clearSeen = () => {
        notifications.value = notifications.value.filter(n => !n.isSeen)
        lastCheck.value = Date.now()
    }

    const deleteOne = (date_created : string) => {
        console.log(date_created)
        notifications.value = notifications.value.filter(n => n.date_created !== date_created)
        lastCheck.value = Date.now()
    }

    const deleteAll = () => {
        notifications.value = []
    }

    return {
        notifications,
        deleteOne,
        deleteAll,
        markAllAsSeen,
        markOneAsSeen,
        clearSeen,
        refreshNotifications
    }
}


/*
*
*   Helper functions 
* 
*/


function alreadyExists(newNotif: LocalNotification, existing: LocalNotification[]) {
    return existing.some(n =>
        n.type === newNotif.type &&
        n.user_from.id === newNotif.user_from.id &&
        n.user_for === newNotif.user_for &&
        n.date_created === newNotif.date_created
    )
}

function trimAndSort(list: LocalNotification[], maxAgeDays = 7, maxCount = 100): LocalNotification[] {
    const maxAge = Date.now() - maxAgeDays * 86400_000
    return list
        .filter(n => new Date(n.date_created).getTime() > maxAge)
        .sort((a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime())
        .slice(0, maxCount)
}

function getFindsLikes(userId: string, since: string): Promise<any[]> {
  return useGetItems({
        collection: 'Finds_likes',
        query: {
            filter: {
                _and: [
                    {
                        item: { 
                            owner: { _eq: userId }
                        }
                    },
                    { 
                        date_created: { _gt: since }
                    },
                    // { 
                    //     user_created: { _neq: userId }
                    // }
                ]
            },
            fields: [
                'id',
                'item.id',
                'item.owner',
                'item.images.directus_files_id',
                'user_created',
                'user_created.id',
                'user_created.username',
                'user_created.displayName',
                'user_created.avatar',
                'date_created',
                
            ]
        }
    })
}

function getThoughtsLikes(userId: string, since: string): Promise<any[]> {
    return useGetItems({
        collection: 'Thoughts_likes',
        query: {
            filter: {
                _and: [
                    { 
                        item: { 
                            owner: { _eq: userId } 
                        } 
                    },
                    { 
                        date_created: { _gt: since } 
                    },
                    { 
                        user_created: { _neq: userId }
                    }
                ]
            },
            fields: [
                'id',
                'item',
                'item.owner',
                'user_created.id',
                'user_created.username',
                'user_created.displayName',
                'user_created.avatar',
                'date_created'
            ]
        }
      })

}

function getThoughtsComments(userId: string, since: string): Promise<any[]> {
    return useGetItems({
        collection: 'Thoughts_comments',
        query: {
          filter: {
            _and: [
                { 
                    item: { 
                        owner: { _eq: userId } 
                    } 
                },
                { 
                    date_created: { _gt: since } 
                },
                { 
                    user_created: { _neq: userId }
                }
            ]
          },
          fields: [
            'id',
            'item',
            'item.owner',
            'user_created.id',
            'user_created.username',
            'user_created.displayName',
            'user_created.avatar',
            'date_created'
          ]
        }
    })
}

function getFollows(userId: string, since: string): Promise<any[]> {
    return useGetItems({
        collection: 'Follows',
        query: {
          filter: {
                _and: [
                    { followed: { _eq: userId } },
                    { date_created: { _gt: since } }
                ]
            },
            fields: [
                'id',
                'follower.id',
                'follower.username',
                'follower.displayName',
                'follower.avatar',
                'followed',
                'date_created'
            ]
        }
    })
}


//
// Notification Types & Interface
//

type NotificationType =
  | 'new_find'
  | 'like_find'
  | 'comment_find'
  | 'new_thought'
  | 'like_thought'
  | 'comment_thought'
  | 'like_comment'
  | 'follow'
  | 'gold_find'
  | 'ancient_find'
  | 'id_request';

interface LocalNotification {
    type: NotificationType;
    action: string; 
    content?: string;     
    user_from: {
        id: string;
        username: string;
        displayName: string,
        avatar: string;
    }; 
    user_for?: string;
    item?: {
        id: string,
        collection?: string
        thumbnail: string
        toPath?: string
    }
    date_created: string;
    isSeen: boolean;
}