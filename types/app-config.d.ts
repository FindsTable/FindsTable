declare module '@nuxt/schema' {
  interface AppConfigInput {
    permanentCacheKeys: CacheKey[]
    version: string
  }
}