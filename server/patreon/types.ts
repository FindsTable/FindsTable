export {
    isMember,
    isTier,
    IncludedItem,
    responseUser,
    PatreonTokens_Raw
}
interface PatreonTokens_Raw {
    access_token: string;
    expires_in: number;
    token_type: string
    refresh_token: string
}

/*
these functions prevent TS to throw arrors when looping through the includes
*/
function isMember(item: IncludedItem): item is Member {
    return item.type === 'member';
}

function isTier(item: IncludedItem): item is Tier {
    return item.type === 'tier';
}

interface Member {
    id: string;
    type: "member";
    attributes: {
        full_name?: string;
        last_charge_status?: string;
        patron_status?: string;
    };
}

interface Tier {
    attributes: {
    };
    id: string;
    type: "tier";

}

type IncludedItem = Member | Tier

interface responseUser {
    data: {
        attributes: {
            email: string;
            first_name: string;
            full_name: string,
            url: string,
            thumb_url: string | null
        };
        id: string;
        type: 'user'
    },
    included: IncludedItem[]
}