import {isMember, isTier, PatreonTokens_Raw } from './types'


export {
    patreon_getTokensWithCode,
    patreon_getMe,
    formatUserState_Patreon,
    refactorTokens
}

async function patreon_getTokensWithCode(
    code: string
): Promise<ApiResponse<PatreonAuthorization | null>> {
    const runtimeConfig = useRuntimeConfig()
    
    try {
        const tokens = await $fetch<any>(
            'https://www.patreon.com/api/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                code: code,
                grant_type: 'authorization_code',
                client_id: runtimeConfig.public.PATREON_FINDSTABLENET_CLIENT_ID,
                client_secret: runtimeConfig.PATREON_FINDSTABLENET_CLIENT_SECRET,
                redirect_uri: setRedirectUrl()
            }).toString()
        });

        if (tokens.scope) {
            delete tokens.scope
        }

        if(!tokens) throw new Error()
         
        return tokens
    } catch(error) {
        throw newError({
            code: 400,
            message: 'Bad request',
            reason: 'Patreon did not provide tokens'
        })
    }
}

function setRedirectUrl(): string {
    let url = ''
    if (process.env.NODE_ENV === 'development') {
        url = 'https://dev.findstable.net:3000/redirection/patreon/link-account'
    }
    if (process.env.NODE_ENV === 'production') {
        url = 'https://findstable.net/redirection/patreon/link-account'
    }
    return url
}

async function patreon_getMe(
    bearerToken: string
): Promise<ApiResponse<PatreonUser | null>> {
    try {
        const user: any = await $fetch(

            `https://www.patreon.com/api/oauth2/v2/identity`,
            {
                method: 'GET',
                headers: {
                    'Authorization': bearerToken
                },
                // params: {
                //     'fields[user]': 'full_name,email,url,thumb_url',
                //     'include': 'memberships,campaign,memberships.currently_entitled_tiers',
                //     'fields[member]': 'patron_status,last_charge_status,last_charge_date,next_charge_date'
                // }
                params: {
                    'fields[user]': 'full_name,email,url,thumb_url',
                    'include': 'memberships,memberships.campaign,memberships.currently_entitled_tiers',
                    'fields[member]': 'patron_status,last_charge_status,last_charge_date,next_charge_date',

                }
            }
        )

        return user
    } catch(error: any) {
        throw newError({
            code: 400,
            message: 'Bad request',
            reason: 'Internal Patreon Server Error'
        })
    }
}

function formatUserState_Patreon(
    rawUser: any
): any {

    let user = rawUser.data
    
    let patreonAccount : FT_patreon_account = {
        status: 'active',
        id: user.id,
        email: user.attributes.email,
        url: user.attributes.url,
        thumb_url: user.attributes.thumb_url,
        member_id: '',
        tierId: '',
        patron_status: '',
        last_charge_status: '',
        next_charge_date: '',
    }

    if(rawUser.included) {
        //  Users that haven't subscribed to the campaign might not have a .included
        let member = rawUser.included.find((item: any) => item.relationships.campaign.data.id === "12159407");

        if(member) {
            // If they have a membership to Findstable
            patreonAccount.member_id = member.id,
            patreonAccount.tierId = member.relationships.currently_entitled_tiers.data[0].id,
            patreonAccount.patron_status = member.attributes.patron_status,
            patreonAccount.last_charge_status = member.attributes.last_charge_status,
            patreonAccount.next_charge_date = member.attributes.next_charge_date
        }
    }

    return patreonAccount
}

function refactorTokens(
    tokens: any
): PatreonAuthorization {

    /*
    patreon provides a "expires_in" value, but we need a "exipre_at" value
    */
    
    let toks: PatreonAuthorization = {
        access_token: tokens.access_token,
        expires_at: Date.now() + (tokens.expires_in * 1000),
        token_type: tokens.token_type,
        refresh_token: tokens.refresh_token
    }

    return toks
}
