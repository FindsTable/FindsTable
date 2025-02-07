import { readEvent } from '@/server/apiUtils/readEvent'

export default defineEventHandler(async (event) => {

    const { id, error } = await readEvent(event, [ 'paramId' ])

    if (error) return error

    const directusUrl = `https://admin.findstable.net/assets/${id}`
    
    return proxyRequest(event, directusUrl)
})