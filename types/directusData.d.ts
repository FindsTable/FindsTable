/*********
* Global
*********/
export type {
    Method,
    UUID,
    UserId,
    FileId,
    TimeStamp,
    DirectusTranslation,
    DirectusResponse
};
/*********
* App
*********/
export type {
    AppManifest,
    FrontEndCacheEntries,
    LegalNotice,
    LegalNoticeTranslation
};
/*********
* Collections
*********/

export {
    DirectusCollection,
    TyOfCollection
}

/******************
* User
******************/
export {
    PersonalDataRecord,
    PersonalDataValue
};

/******************
* Patreon account
******************/

export {
    PatreonAccount,
    PatreonTier
};

/******************
* BADGE
******************/
export {
    BadgeKey,
    VariationKey,
    BadgeTranslation,
    BadgeVariation,
    Badge,
    UserBadgeId,
    UserBadge,
    BadgeRecord
};

/******************
* Bookmarks
******************/

export {
    Bookmark,
    BookmarkId
};

/******************
* Thought
******************/
export {
    ThoughtId,
    Thought,
    ThoughtComment,
    ThoughtLike
};

/******************
* ItemComment
******************/
export {
    ItemCommentId,
    ItemComment
};

/******************
* Likes
******************/

export {
    LikeId,
    Like
};

/******************
* Find
******************/

export {
    FindId,
    Find,
    FindComment,
    FindLike,
    FindImageId,
    FindImage,
    FindMetal,
};

/******************
* Resourses
******************/

export {
    MetalId,
    Metal,
    DatingPeriod,
    FindTypeId
};

/******************
* Follow
******************/
export {
    Follow
};

/******************
* Avatar
******************/

export {
    Avatars
};


declare global {


/******************
* GLLOBAL TYPES
******************/
type Method = 'GET' | 'POST' | 'DELETE' | 'PATCH'
type UNACCESSIBLE = 'UNACCESSIBLE'
type FileId = UUID;

type VersionNumber = string
type UUID = string;
type TimeStamp = `${number}-${number}-${number}T${number}:${number}:${number}.${number}Z`;
type UserId = UUID;
type SameAsUserId = UserId

type DirectusTranslation = {
  id: UUID;
  key: 'fr';
};

type DirectusResponse<T> = {
    data: T;
}

/*********
* Collections
*********/

/*
*   Define a subtype based on collection
*/
type ItemType<
    Collection extends Record<string, any>,
    Overrides extends Partial<Record<keyof Collection, any>>
> = {
    [K in keyof Overrides]: K extends keyof Collection ? Overrides[K] : never;
};

type DirectusCollection =
  | 'App_manifest'
  | 'Avatars'
  | 'Badge_record'
  | 'Badges'
  | 'Badges_translations'
  | 'Badge_variations'
  | 'Bookmarks'
  | 'Dating_periods'
  | 'Finds'
  | 'Finds_comments'
  | 'Finds_likes'
  | 'Finds_images'
  | 'Finds_metals'
  | 'Find_types'
  | 'Find_types_translations'
  | 'FrontEnd_cache_entries'
  | 'Follows'
  | 'Invitation_codes'
  | 'Languages'
  | 'Legal_notice'
  | 'Metals'
  | 'Patreon_accounts'
  | 'Patreon_tiers'
  | 'Patreon_tier_translations'
  | 'PersonalData_record'
  | 'PersonalData_values'
  | 'Thoughts'
  | 'Thoughts_comments'
  | 'Thoughts_likes'
  | 'User_badges'




type TypeOfCollection<
  Coll extends DirectusCollection
> = {

    Badge_record:               BadgeRecord;
    User_badges:                UserBadge;
    PersonalData_values:        PersonalDataValue;
    Thoughts:                   Thought;
    Finds:                      Find;
    Finds_metals:               FindMetal;
    Legal_notice:               LegalNotice;

  PersonalData_record:          PersonalDataRecord;
  Bookmarks:                    Bookmark;
  Thoughts_comments:            ItemComment;
  Thoughts_likes:               Like;
  Finds_comments:               ItemComment;
  Finds_likes:                  Like;
  Finds_images:                 FindImage;
  Follows:                      Follow;
  Avatars:                      Avatar;
  Metals:                       Metal;
  Dating_periods:               DatingPeriod;
  Find_types:                   FindType;
  Find_types_translations:      FindTypeTranslation;
  Badges:                       Badge;
  Badges_translations:          BadgeTranslation;
  Badge_variations:             BadgeVariation;
  Patreon_accounts:             PatreonAccount;
  Patreon_tiers:                PatreonTier;
  Patreon_tier_translations:    PatreonTierTranslation;
  Legal_notices_translations:   LegalNoticeTranslation;
  App_manifest:                 AppManifest;
  FrontEnd_cache_entries:       FrontEndCacheEntries;
}[Coll];


/******************************************************************************************
*
*   Validation of the field path strings.
*   Checks if all steps in 'owner.avatar.id' are valid files
*
*******************************************************************************************/
type ArrayOfValidFields<
    CollType extends Record<string, any>, 
    Array extends readonly  string[]
> = Array extends []
        ? []
        : Array extends [infer First, ...infer Rest]
            ? First extends string
                ? Rest extends readonly string[]
                    ? [ValidPath<CollType, First>, ...ArrayOfValidFields<CollType, Rest>]
                    : ErrorMessage<`Rest must be an array of strings`>
                : ErrorMessage<`${First} must be a string !!`>
            : ErrorMessage<`Not an array of strings`>
;

type ErrorMessage<Message extends string> = {
    error: Message;
    }
;

type Asterix = '*';

type ValidPath<
    CollType extends Record<string, any>,
    Path extends string
> = Path extends `${infer Head}.${infer Rest}`
        ? Head extends keyof CollType
                ? Rest extends ValidPath<CollType[Head], Rest>
                    ? Path
                    : ErrorMessage<`${Rest} is not a valid Field of ${CollType[Head]}`>
                : Head extends Asterix
                    ? Asterix
                    : ErrorMessage<`${Head} is not a valid`>
        : Path extends Asterix
            ? Asterix
            : Path extends keyof CollType
                ? Path
                : never
;

/******************
* APP
******************/

type AppManifest = {
    id: UUID
    version_app: VersionNumber
    cache_entries: FrontEndCacheEntries[]
};

type FrontEndCacheEntries = {
    id: number
    collection: string
    version: VersionNumber
    key: string
    query: string
    App_manifest?: UNACCESSIBLE
};
type LegalNoticeGeneric = {
    translations : LegalNoticeTranslationId[] | LegalNoticeTranslation[];
};

type DefaultLegalNoticeGeneric = {
    translations : LegalNoticeTranslation[];
};

type LegalNotice<
T extends LegalNoticeGeneric = DefaultLegalNoticeGeneric> = {
    id: UUID;
    status: string;
    translations: LegalNoticeTranslationId[] | LegalNoticeTranslation[];
};

type LegalNoticeTranslationId = Number;

type LegalNoticeTranslation = {
    id: Number;
    title: string;
    content: string;
    Legal_notice_id: LegalNotice['id'];
    Languages_id: UUID;
}

/******************
* User
******************/

type User = {
    id: UserId,
    avatar: UUID,
    displayName: string,
    username: `@${string}`
}

type PersonalDataRecord = {
    id: SameAsUserId;
    user: UserId;
    email: PersonalDataValue<email>;
    firstName: PersonalDataValue<firstName>;
    lastName: PersonalDataValue<lastName>;
    country: PersonalDataValue<country>;
    user: UserId;
};

type PersonalDataValue = {
    id: UUID;
    key: key
    value: 'email' | 'firstName' | 'lastName' | 'country';
    isPublic: boolean;
    record: PersonalDataRecord['id'] | PersonalDataRecord
};

/******************
* Patreon account
******************/

export type PatreonAccount = {
    status: string;
    user: UserId;
    email: string;
    id: string;
    tier: PatreonTier['id'] | PatreonTier
    access_token: string;
    expires_at: number;
    token_type: string;
    refresh_token
};

type PatreonTier = {
    id: UUID;
    title: string;
    status: string;
    finds: number;
    translations: UUID | PatreonTierTranslation;
    badge: BadgeVariation['id'] | BadgeVariation;
}
type PatreonTierTranslation = {
    id: UUID
}
/******************
* BADGE
******************/

type BadgeKey = string;
type VariationKey = string;

type BadgeTranslation = {
    Languages_id: number;
    name: string;
    description: string;
};

type BadgeVariation = {
    badgeLevel: VariationKey;
    badge: BadgeKey;
    image: UUID;
};

type Badge = {
    status: string;
    key: BadgeKey;
    type: "multilevel" | "static" | "statistic" | "outsideLink" | "linkedToFinds";
    translations: BadgeTranslation;
    variations: BadgeVariation | VariationKey;
    default: BadgeVariation;
};


type DefaultUserBadge = {
    badge: BadgeKey;
    level: BadgeVariation;
};

type UserBadgeId = UUID;

type UserBadge = {
  id: UserBadgeId;
  date_created?: TimeStamp;
  date_updates?: TimeStamp;
  owner: User | USerId;
  badge: BadgeKey;
  level: BadgeVariation | VariationKey;
};

type BadgeRecordGeneric = {
    slotFormat: UserBadge | UUID
};
type DefaultBadgeRecordGeneric = {
    slotFormat: UserBadge;
};
type BadgeRecord = {
    id: SameAsUserId;
    owner: UserId;
    slot1: UserBadge | UUID;
    slot2: UserBadge | UUID;
    slot3: UserBadge | UUID;
};


/******************
* Bookmarks
******************/

type BookmarkId = UUID
export type Bookmark = {
    id: BookmarkId;
    user_created: UserId | User;
    Finds_id: UUID;
    uniqueKey: `${UserId}-${BookmarkId}`
};

/******************
* Thought
******************/

type ThoughtId = UUID

export type Thought = {
    id: ThoughtId;
    date_created: TimeStamp;
    date_updated: TimeStamp;
    date_lastEvent: TimeStamp;
    owner: UserId;
    content: string;
    comments: ItemComment | ItemCommentId;
    likes: Like | LikeId;
};

/******************
* ItemComment
******************/

type ItemCommentId = UUID

type ItemComment = {
    id: CommentId
    status: string;
    item: item;
    content: string;
    date_created: TimeStamp;
    date_updated: TimeStamp;
    owner: UserId;
};

/******************
* Likes
******************/

type LikeId = UUID;

type Like = {
    id: LikeId;
    item: item;
    date_created: TimeStamp;
    user_created: UserId;
};

/******************
* Find
******************/

type FindId = UUID;

type Find = {
    id: FindId;
    owner: UserId | User;
    date_created: TimeStamp;
    date_updated: TimeStamp;
    date_lastEvent: TimeStamp;
    title: string;
    description: string;
    dating_period: DatingPeriodId | DatingPeriod;
    dating_year_marked: string;
    dating_range_from: string;
    dating_range_to: string;
    type: UUID | FindType;
    images: FindImageID | FindImage;
    metals: FindMetalId | FindMetal;
    likes: Like | LikeId;
    comments: ItemCommentId | FindComment;
    likes_count: number,
};

type FindImageId = UUID

type FindImage = {
    id: FindImageId;
    directus_file_id: UUID;
    Finds_id: UUID
};

type FindMetalId = UUID;

type FindMetal = {
    id: FindMetalId;
    Finds_id: FindId;
    Metals_id: UUID | Metal
};

/******************
* Hunt reports
******************/


type HuntReportId = UUID;
type HuntReport = {
    id: HuntReportId;
    owner: UserId | User;
    status: 'draft' | 'published'
    title: string;
    content: string;
    date: string;
    biome: BiomeKey;
    weatherTags: WeatherTagKey | WeatherTag[];
    banner: FileId;
    bootyPhoto: FileId;
    photos: FileId[];
    finds: FindId[];
}

type weatherTagKey = String;
type weatherTags = {
    key: weatherTagKey;
    en: string;
    fr: string;
};

type BiomeKey = 'beach' | 'field'
type Biome = {
    key: BiomeKey;
    image: FileId;
    en: string;
    fr: string;
}
type LanguageKey = "en" | "fr"

type Language = {
    id: number,
    key: LanguageKey
}
/******************
* Resourses
******************/

type MetalId = 'iron' | 'steel' | 'gold' | 'silver' | 'copper' | 'brass' | 'tin' | 'lead' | 'bronze'
type Metal = {
    id: MetalId;
};
type DatingPeriodId = number;
type DatingPeriod = {
    id: DatingPeriodId;
    value: string;
    range_from: number;
    range_to: number;
};
type FindTypeId = UUID;
type FindType = {
    id: FindTypeId;
    value: string;
    translations: FindTypeTranslation;
};

type FindTypeTranslation = {
    id: UUID,
    Find_types_id: FindTypeId;
    Languages_id: UUID;
    name: string;
};

/******************
* Follow
******************/

export type Follow = {
    id: UUID;
    UniqueKey: string;
    follower: UserId;
    following: UserId;
    date_created: TimeStamp;
};

/******************
* Avatar
******************/
export type Avatar = {
    id: UUID;
    date_created: TimeStamp;
    date_updated: TimeStamp;
    currentAt: number;
    owner: UserId;
    image: UUID;
};
}
