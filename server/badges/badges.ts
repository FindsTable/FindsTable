import { getUserCount } from '@/server/directus/users'
import { updateUserById } from '@/server/directus/users'
import { getUserById } from '@/server/directus/users'

export {
    badges,
    setNewBadgeRecord
}

async function setNewBadgeRecord(userId: string) {
    // const record: {
    //     firstBeliever: null | 'level1',
    //     betaTester: null | 'level1'
    // } = {
    //     firstBeliever: null,
    //     betaTester: 'level1'
    // }

    // if(await badges.firstBeliever.newUserIsIlligible()) {
    //     record.firstBeliever = 'level1'
    // }

    // await updateUserById({
    //     id: userId,
    //     auth: 'app',
    //     body: {
    //         badgeRecord: {
    //             user: userId, //important, the two collections are linked by m2o fields.
    //             ...record
    //         }
    //     }
    // })
}

const badges = {
    firstBeliever: {
        newUserIsIlligible: async () => {

            const userCount = await getUserCount()

            if(userCount === undefined) {
                return false
            }
            if(userCount < 1001) {
                return true
            } else {
                return false
            }
        }
    },
    patreonTier: {
        getUserTIer: (userId: string) => {


        }
    }
}

const account = {
    developer: {
        id: "xxx"
    },
    moderator: {
        id: "yyy"
    },
    betaTester: {
        id: "zzz"
    },
    firstBeliever: {
        id: "www"
    },
    yearOfSignup: {
        id: "nnn"
    },
    monthsAsMember: {
        id: "nnn"
    }
}

const activity = {
    activefinds: {
        id: "aaa"
    },
    activeArticles: {
        id: "bbb"
    },
    biome: {
        forest: {
            id: "aaa"
        },
        beach: {
            id: "bbb"
        },
        field: {
            id: "bbb"
        },
        road: {
            id: "bbb"
        },
        park: {
            id: "bbb"
        },
        submarine: {
            id: "bbb"
        },
        ruins: {
            id: "bbb"
        },
        backyard: {
            id: "bbb"
        }
        }
}

const contentCreator = {
    creator: {
        videos: {
            id: "aaa"
        },
        blog: {
            id: "aaa"
        },
        shop: {
            id: "xxx"
        },
        instagram: {
            id: "xxx"
        },
        facebook: {
            id: "xxx"
        }
    }
}