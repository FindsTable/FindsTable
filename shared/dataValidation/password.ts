import { sharedAppConfig } from "../sharedAppConfig";

export {
    assertPasswordFormat,
    passwordFormatIsValid
};

function assertPasswordFormat(
    password : string
) : void {

    const rules = sharedAppConfig.dataValidation.password.rules;

    for(let rule of rules) {
        if(!rule.active) continue;

        if(!rule.regEx.test(password)) {
            throw toasterError({
                code : 401,
                message: "Bad request",
                reason: rule.error.reason,
                toasterPath: rule.error.toasterPath,
            });
        };
    }
}

function passwordFormatIsValid (
    password: string
) : boolean {
    try {
        assertPasswordFormat(password)
        return true
    }
    catch(err) {
        return false
    }
}