# Composables Documentation

## activity.ts
- `useLike(params: { action: 'like' | 'unlike', collection: string, itemId?: string, likeId?: string }): Promise<UseLikeResult>`
  - Handles liking/unliking items in collections. Returns success/failure status with data.

## apiResponse.ts
- `useParseApiResponse<Data>(r: ApiResponse<any>): ParsedApiResponse<Data>`
  - Parses API responses into a standardized format with error handling.

## appState.ts
- `useAppState(): State`
  - Global app state management with reactive state for:
    - internetConnection: boolean
    - showSideBar: boolean
    - fullScreen: boolean
    - modal configuration
    - patreon campaign info
    - layout state

## authUtils.ts
- `useLoginFlow(flow: 'emailAndPassword' | 'refreshTokenCookie', p: { email: string, password: string }): Promise<boolean>`
  - Handles user authentication flow
- `useHandleSignup(p: { invitationCode: string, username: string, email: string, password: string, passwordConfirmation: string }): Promise<any>`
  - Manages new user signup process
- `useAnonymizeEmail(email: string): string`
  - Anonymizes email addresses for privacy

## await.ts
- `useAwait(promise: Promise<any>): { data: Ref<any>, error: Ref<any>, pending: Ref<boolean> }`
  - Utility for handling async operations with reactive states

## cache.ts
- `useCache(): State`
  - Manages navigation cache state

## confirmationModal.ts
- `useConfirmationModalState(): State`
  - State management for confirmation modals
- `useConfirmationModal(): { openModal: Function, confirm: Function, cancel: Function }`
  - Controls for confirmation modal interactions

## date.ts
- `useDateFormat(date: Date | string, format?: string): string`
  - Date formatting utilities

## directus.ts
- `useDirectAsyncFetch<T>(method?: Method, path?: string, options?: Options): UseDirectFetchReturn<T>`
  - Async fetch wrapper for Directus API
- `useDirectFetch(): { fetch: Function }`
  - Direct Directus API communication

## feed.ts
- `useFeed<CollName, ItemType>(collection: DirectusCollection, fieldsArray: string[]): { feed: ComputedRef<ItemType[]>, removeItem: Function, getNextPage: Function }`
  - Manages paginated feed of items from a collection

## fetch.ts
- `useFetch(url: string, options?: FetchOptions): Promise<any>`
  - Configured fetch utility with auth and error handling

## findsTableApp.ts
- `useFTApp(): AppState`
  - Core application state and functionality
- `useAppContent(): AppContent`
  - Access to application content
- `findInLocalState(id: string): any`
  - Search for items in local state

## i18n.ts
- `use$t(key: string, params?: any): string`
  - Translation utility
- `useLocaleText(key: string, params?: any): ComputedRef<string>`
  - Reactive translation lookup
- `useI18n(): VueI18n`
  - Access to i18n instance

## images.ts
- `useApplyImageFormatPreset(imageFormatPresetKey: ImageFormatPresetKey, inputFile: File): Promise<File>`
  - Applies image formatting presets to files

## items.ts
- `useGetItems(p: { collection: string, query: { [key: string]: any } }): Promise<any>`
  - Fetches items from collections with query options

## modals.ts
- `useModalState(): State`
  - Modal state management
- `useModal(): { openModal: Function, confirm: Function, cancel: Function }`
  - Modal control functions

## notifications.ts
- `useNotifications(): { notifications: Ref<Notification[]>, add: Function, remove: Function }`
  - Manages user notifications

## stateUtils.ts
- `useLoadStateData(store: 'userState' | 'appState', data: any): void`
  - Utility for loading data into state stores

## toaster.ts
- `useToaster(action: 'show' | 'hide', toaster: ToasterData): void`
  - Shows/hides toast notifications
- `useToasters(): State`
  - Manages multiple toasts
- `useWelcomeBackString(): string`
  - Generates welcome back message

## userContent.ts
- `useUserContent(): State`
  - Access to user's content (avatars, finds, badges, etc.)
- `useHandleUserContent(): { loadUserContent: Function, refreshCollection: Function }`
  - Functions for managing user content

## userState.ts
- `useUserState(): State`
  - User authentication and preference state
- `useClearUserState(): void`
  - Clears user state and cookies

## userUtils.ts
- `useUpdateMe_user(options: { body: any, query?: any, onRequest?: Function, onResponse?: Function, onResponseError?: Function }): Promise<any>`
  - Updates user profile
- `useUpdateMe_recordValue(options: { body: any, query?: any, onRequest?: Function, onResponse?: Function, onResponseError?: Function }): Promise<any>`
  - Updates user record values
- `useDeleteMyAccount(options: { body: { confirmation: string, username: string }, onRequest?: Function, onResponse?: Function, onResponseError?: Function }): Promise<any>`
  - Handles account deletion process
