export {
    useLike
}

async function useLike(p: UseLikeParams): Promise<UseLikeResult> {
    const token = useUserState().value.accessToken.value;

    try {
        if (p.action === 'like') {
            if (!p.itemId) throw new Error('Missing itemId for like action');
            

            const res : any = await $fetch(`https://admin.findstable.net/items/${p.collection}`, {
                method: 'POST',
                headers: {
                    authorization: `Bearer ${token}`,
                },
                body: {
                    item: p.itemId,
                },
                query: {
                    fields: '*',
                },
            });

            console.log(res.data)
            return res.data
        }

        if (p.action === 'unlike') {
            if (!p.likeId) throw new Error('Missing likeId for unlike action');

            await $fetch(`https://admin.findstable.net/items/${p.collection}/${p.likeId}`, {
                method: 'DELETE',
                headers: {
                    authorization: `Bearer ${token}`,
                },
            });
        }
    } catch (err) {
        useHandleError(err)
    }
}


type UseLikeParams = {
    action: 'like' | 'unlike';
    collection: string;
    itemId?: string;
    likeId?: string;
};

type UseLikeResult =
    | { ok: true; status: 'liked'; data: any }
    | { ok: true; status: 'unliked' }
    | { ok: false; status: 'like_failed'; error?: any }
    | { ok: false; status: 'unlike_failed'; error?: any };