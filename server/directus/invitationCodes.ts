import { appGet } from '@@/server/directus/request';

export {
    invitationCodeIsValid
}

async function invitationCodeIsValid(code: string): Promise<void> {
    const res = await appGet<any[]>({
        endpoint: '/items/Invitation_codes',
        query: {
            filter: { 
                _and: [
                    {
                        id: { 
                            _eq: code 
                        } 
                    },
                    {
                        usedBy: {
                            _eq: null
                        }
                    }
                ]
            }
        }
    });

    if (!res.length) {
        throw toasterError({
            code: 403,
            message: "Unauthorized",
            reason: "Invitation code is not valid",
            toasterPath: "forms.userAccount.invitationCode.notValid"
        });
    }
}