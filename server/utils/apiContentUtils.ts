import { updateMe } from '@/server/directus/users'

export {
    updateItemsCountField
}

async function updateItemsCountField(p: {
    bearerToken: string,
    field: 'finds_count' | 'avatars_count' | 'thoughts_count' | 'comments_count' | 'huntReports_count',
    newValue: number
  }): Promise<number | undefined> {
  
    const { data } = await updateMe({
      bearerToken: p.bearerToken,
      body: {
        [p.field]: p.newValue < 0 ? 0 : p.newValue //safety in case of desync of items_count and actual items number
      },
      query: {
        fields: p.field
      }
    })
  
    if (typeof data?.[p.field] === 'number') {
      return data[p.field]
    }
  
    return undefined
}