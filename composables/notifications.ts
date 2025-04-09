// Composable: useNotifications.ts

import { useStorage } from '@vueuse/core' // from VueUse
// If you rely on auto-import for useGetItems, remove this line:
// import { useGetItems } from '@/composables/useGetItems'

//
// Notification Types & Interface
//

export type NotificationType =
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

export interface LocalNotification {
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
  date_created: string;
  isSeen: boolean;
}
//
// Main composable
//
export const useNotifications = ( userId : string ) => {
  // Locally stored, reactive arrays
  const notifications = useStorage<LocalNotification[]>('findsTable_notifications', [])
  const lastCheck = useStorage<number>('findsTable_lastNotifCheck', Date.now())

  // If auto-imported by Nuxt, this is enough:
  const getItems = useGetItems

  //
  // 1. Manually add a local-only notification
  //
  const addNotification = (notif: LocalNotification) => {
    notifications.value.push(notif)
    notifications.value = trimAndSort(notifications.value)
  }

  //
  // 2. Mark all notifs as seen
  //
  const markAsSeen = () => {
    notifications.value = notifications.value.map(n => ({ ...n, isSeen: true }))
  }
  const markOneAsSeen = (date_created: string) => {
  notifications.value = notifications.value.map(n =>
    n.date_created === date_created
      ? { ...n, isSeen: true }
      : n
  )
}

  //
  // 3. Remove all notifs that are seen
  //

    const clearSeen = () => {
        notifications.value = notifications.value.filter(n => !n.isSeen)
        lastCheck.value = Date.now()
    }
  //
  // 4. Refresh from Directus
  //
  
  const refreshNotifications = async () => {
    const since = new Date(lastCheck.value).toISOString()
    const now = Date.now()

    //
    // We fetch data from all relevant collections in parallel
    // (comment out if not ready yet!)
    //
    const [
      findsLikes,
      // findsComments, // <-- Uncomment when ready
      thoughtsLikes,
      thoughtsComments,
      follows,
      // newUsers // <-- If you want to notify admins about new users
    ] = await Promise.all([
      // For Finds Likes
      getItems({
        collection: 'Finds_likes',
        query: {
            filter: {
                _and: [
                    {
                        item: {
                            owner: {
                                _eq: userId
                            }
                        }
                    },
                    {
                        created_at: { 
                            _gt: since 
                        }
                    }
                ]
            },
            fields: [
                'id',
                'item',
                'user_created',
                'item.owner',
                'user_created.id',
                'user_created.username',
                'user_created.displayName',
                'user_created.avatar',
                'date_created'
            ]
        }
      }),

      // For Finds Comments (commented out, if the table isn't ready)
      /*
      getItems({
        collection: 'Finds_comments',
        query: {
            filter: {
                _and: [
                    {
                        item: {
                            owner: {
                                _eq: userId
                            }
                        }
                    },
                    {
                        created_at: { 
                            _gt: since 
                        }
                    }
                ]
            }
        }
      }),
      */

      // For Thoughts Likes
      getItems({
        collection: 'Thoughts_likes',
        query: {
            filter: {
                _and: [
                    {
                        item: {
                            owner: {
                                _eq: userId
                            }
                        }
                    },
                    {
                        created_at: { 
                            _gt: since 
                        }
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
      }),

      // For Thoughts Comments
      getItems({
        collection: 'Thoughts_comments',
        query: {
            filter: {
                _and: [
                    {
                        item: {
                            owner: {
                                _eq: userId
                            }
                        }
                    },
                    {
                        created_at: { 
                            _gt: since 
                        }
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
      }),

      // For Follows
      getItems({
        collection: 'Follows',
        query: {
            filter: {
                _and: [
                    {
                        followed: {
                            _eq: userId
                        }
                    },
                    {
                        created_at: { 
                            _gt: since 
                        }
                    }
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
      }),

      // For new Users (if you want to notify admins or something)
      /*
      getItems({
        collection: 'directus_users',
        query: {
            filter: {
                created_at: { _gt: since }
            }
        }
      })
      */
    ])

    const newNotifs: LocalNotification[] = []

    //
    // 4.1 Build notifications for Finds Likes
    //
    for (const like of findsLikes) {
      newNotifs.push({
        type: 'like_find',
        action: "liked",
        content: "yourFind",
        user_from: like.user_created,
        user_for: like.item.owner,
        date_created: like.date_created,
        isSeen: false
      })
    }

    //
    // 4.2 Build notifications for Finds Comments (when table is ready)
    //
    // if (findsComments) {
    //     for (const c of findsComments) {
    //         newNotifs.push({
    //             type: 'comment_find',
    //             action: "commented",
    //             content: "yourFind",
    //             user_from: c.owner,
    //             user_for: c.find.owner,
    //             date_created: c.date_created,
    //             isSeen: false
    //         })
    //     }
    // }

    //
    // 4.3 Build notifications for Thoughts Likes
    //
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

    //
    // 4.4 Build notifications for Thoughts Comments
    //
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

    //
    // 4.5 Build notifications for Follows
    //
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

    //
    // 4.6 Build notifications for new users (if wanted)
    //
    // if (newUsers) {
    //   for (const newUser of newUsers) {
    //      newNotifs.push({
    //          type: 'new_user',
    //          action: "signedUp",
    //          content: "",
    //      user_from: newUser.id, // or no actor?
    //      user_for: '',
    //      date_created: newUser.date_created,
    //       isSeen: false
    //     })
    //   }
    // }

    //
    // 4.7 Merge, dedupe, then store
    //


    notifications.value = trimAndSort([
      ...notifications.value,
      ...newNotifs.filter(n => !alreadyExists(n, notifications.value))
    ])

    lastCheck.value = now
  }

  return {
    notifications,
    addNotification,
    markAsSeen,
    markOneAsSeen,
    clearSeen,
    refreshNotifications
  }
}

//
// Helpers
//

function alreadyExists(newNotif: LocalNotification, existing: LocalNotification[]) {
  return existing.some(n =>
    n.type === newNotif.type &&
    n.user_from.id === newNotif.user_from.id &&
    n.user_for === newNotif.user_for &&
    n.date_created === newNotif.date_created
  )
}
function trimAndSort(list: LocalNotification[], maxAgeDays = 7, maxCount = 100): LocalNotification[] {
  const cutoff = Date.now() - maxAgeDays * 86400_000
  return list
    .filter(n => new Date(n.date_created).getTime() > cutoff)
    .sort((a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime())
    .slice(0, maxCount)
}
