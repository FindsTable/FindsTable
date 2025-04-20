async function useFollow( p : {
    action: 'start' | 'stop'
    followed: UserId
    followId?: string
}) {

    const {
        path,
        method,
        options
    } = configureRequest(p)

    const {
        response,
        error,
        isPending,
        refresh,
        directFetch
      } = useDirectAsyncFetch(
        method,
        path,
        {
            ...options,
            differed: false
        }
    )

}

type UserId = string


function configureRequest( p : {
    action: 'start' | 'stop'
    followed: UserId
    followId?: string
}) {

    let path : Path = ''
    let method : Method = 'POST'
    const options : Options = {}

    if(p.action === 'start') {
        path = 'items/Follows'
        options.body = {
            followed: p.followed
        }
    } else if(p.action === 'stop') {
        path = `/item/Follows/${p.followId}`
        method = 'DELETE'
    }

    return {
        path,
        method,
        options
    }

}

type Method = 'POST' | 'DELETE'
type Path = string


type Options = {
    query?: any,
    body?: any
}