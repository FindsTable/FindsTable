export type {
    UserId, SameAsUserId
}

export type {
    SuccessBadge, BadgeKey,
    BadgeRecord
}

type UserId = string
type SameAsUserId = UserId

type BadgeKey = 
    "patreonLinked"
    | "betaUser"
    | "goldDancer"
    | "findCount5"

type SuccessBadge = {
    status: "active" | "notActive" | "archived";
    key: BadgeKey;
    type: "static" | "statComputed" | "itemLinked";
    image: "string";
    Badge_records: string[];
};

type BadgeRecord = {
    Status:  "active" | "notActive" | "archived";
    id: SameAsUserId
    slot1: SuccessBadge | BadgeKey
    slot2: SuccessBadge | BadgeKey
    slot3: SuccessBadge | BadgeKey
    badges: SuccessBadge[] | |BadgeKey[]
}