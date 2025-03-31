import { readEvent } from '@/server/apiUtils/readEvent'
import { createItem } from '@/server/directus/items'
import { uploadFile } from '@/server/directus/files'
import { getItemById } from '@/server/directus/items'
import { getMe } from '@/server/directus/users'
import { ItemObject } from '~/shared/types/dataObjects'
import { H3Event } from 'h3'

interface MetaImage {
  key: string;
  collection: string;
  role?: string;
}

interface MetaData {
  collection: string;
  images?: MetaImage[];
}

interface Cache {
  [key: string]: any;
  meta?: MetaData;
  item?: any;
  itemId?: string;
}

interface SimpleResponse {
  ok: boolean;
  statusText: string;
  data?: any;
}

export default defineEventHandler(async <ExpectedItemObject extends ItemObject>(
  event: H3Event
): Promise<ApiResponse<ExpectedItemObject | null>> => {
  // Read event and ensure token exists.
  const { bearerToken, error: tokenError } = await readEvent(event, ['bearerToken'])
  if (tokenError) return tokenError

  const userId = await getUserId(bearerToken!)
  if (!userId) {
    return {
      ok: false,
      statusText: 'User is not logged in.',
      data: null
    }
  }

  const fd = await readMultipartFormData(event)
  if (!fd) {
    return {
      ok: false,
      data: null,
      statusText: 'No formdata'
    }
  }

  const cache: Cache = {}

  // Populate cache: if text, convert Buffer->string->JSON if possible; if file, store the entry.
  for (const entry of fd) {
    if (entry.filename === undefined) {
      const text = entry.data.toString('utf-8')
      try {
        cache[entry.name!] = JSON.parse(text)
      } catch (e) {
        cache[entry.name!] = text
      }
    } else {
      cache[entry.name!] = entry
    }
  }

  // Check that meta data exists
  if (!cache.meta) {
    return {
      ok: false,
      statusText: 'Meta data missing',
      data: null
    }
  }
  console.log("check", cache.meta.collection)
  // Create the Finds item using cache.item and the collection defined in meta.
  const createItemRes = await createItemGetId(cache.meta.collection, addOwnerId(cache.item, userId) )

  if (!createItemRes.ok) {
    return {
      ok: false,
      statusText: `Failed to create main item: ${createItemRes.statusText}`,
      data: cache.item
    }
  }
  cache.itemId = createItemRes.data

  // Process images in meta (upload file and create junction record).
  if (cache.meta.images && cache.meta.images.length) {
    for (const img of cache.meta.images) {
      const fileEntry = cache[img.key]
      if (!fileEntry) continue

      const fileFormData = new FormData()
      const blob = new Blob([fileEntry.data], { type: fileEntry.mimetype || 'application/octet-stream' })
      fileFormData.append('file', blob, fileEntry.filename)

      const uploadRes = await uploadFileGetId(fileFormData)
      if (!uploadRes.ok) {
        return {
          ok: false,
          statusText: `Failed to upload file for key ${img.key}: ${uploadRes.statusText}`,
          data: null
        }
      }
      const fileId = uploadRes.data

      const junctionRes = await createItem({
        collection: img.collection,
        auth: 'app',
        body: {
          Finds_id: cache.itemId,
          directus_files_id: fileId
        },
        query: {
          fields: 'id'
        }
      })

      if (!junctionRes.ok) {
        return {
          ok: false,
          statusText: `Failed to create junction record for file ${fileId}: ${junctionRes.statusText}`,
          data: null
        }
      }
    }
  }

  // Retrieve the final Finds item.
  const itemRes = await getItemById({
    collection: 'Finds',
    auth: 'app',
    id: cache.itemId!
  })

  if (itemRes.ok && itemRes.data) {
    return {
        ok: true,
        data: itemRes.data,
        statusText: 'Success'
    }
    
  }

  return {
    ok: false,
    statusText: 'Failed to retrieve item after creation',
    data: null
  }
  
})

// Helper to get user id
async function getUserId(bearerToken: string): Promise<string | undefined> {
  const { data } = await getMe({
    bearerToken: bearerToken,
    query: {
      fields: 'id'
    }
  })
  return data ? data.id : undefined
}

// Helper to create an item and return its ID.
async function createItemGetId(collection: string, item: any): Promise<SimpleResponse> {
    console.log(item)
  const res = await createItem<any>({
    auth: "app",
    collection: collection,
    body: item,
    query: {
      fields: 'id'
    }
  })

  if (!res.ok) {
    return { ok: false, statusText: res.statusText }
  }
  return { ok: true, statusText: 'Created', data: res.data.id }
}

// Helper to upload a file and return its ID.
async function uploadFileGetId(fd: FormData): Promise<SimpleResponse> {
  const res = await uploadFile(fd)
  if (!res.ok) {
    return { ok: false, statusText: res.statusText }
  }
  return { ok: true, statusText: 'Uploaded', data: res.data.id }
}

function addOwnerId(item : any, id : string) {
    return {
        ...item,
        owner: id
    }
}