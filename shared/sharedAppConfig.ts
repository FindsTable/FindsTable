export {
    sharedAppConfig
}

const email : Email = {
    regExps: {
        emailCharsRegEx: /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~.@-]+$/,
        localCharsRegEx: /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~.-]+$/,
        domainCharsRegEx: /^[a-zA-Z0-9.-]+$/,
        domainLabelCharsRegEx: /^[a-zA-Z0-9-]+$/,
    },
    error: {
        reason: "Email format is not valid",
        toasterPath: 'errors.email.format'
    }
}

const password : {
    rules: PasswordRule[]
}= {
    rules: [
        {
            active: true,
            name: 'length',
            regEx: /^.{4,100}$/,
            error: {
                reason: "password length not valid",
                toasterPath: 'errors.password.length'
            }
        },
        {
            active: false,
            name: 'hasUppercase',
            regEx: /[A-Z]/,
            error: {
                reason: "password must contain an uppercase letter",
                toasterPath: 'errors.password.hasUppercase'
            }
        },
        {
            active: false,
            name: 'hasLowercase',
            regEx: /[a-z]/,
            error: {
                reason: "password must contain a lowercase letter",
                toasterPath: 'errors.password.hasLowercase'
            }
        },
        {
            active: false,
            name: 'hasNumber',
            regEx: /\d/,
            error: {
                reason: "password must contain a number",
                toasterPath: 'errors.password.hasNumber'
            }
        },
        {
            active: false,
            name: 'hasSpecialChar',
            regEx: /[!@#$%^&*(),.?":{}|<>]/,
            error: {
                reason: "password must contain a special character",
                toasterPath: 'errors.password.hasSpecialChar'
            }
        }
    ]
}

const allowedMimeTypes : AllowedMimeTypes = {
    images: {
        input: [ 
            "image/jpeg", 
            "image/png", 
            "image/webp"],
        formated: [ 
            "image/webp" 
        ]
    }
}

const sharedAppConfig : SharedAppConfig = {
    dataValidation: {
        password: password,
        allowedMimeTypes,
        email: email
    }
}

type AllowedMimeTypes = {
    images: {
        input: string[],
        formated: string[]
    }
}

type PasswordRule = {
    active: boolean,
    name: string,
    regEx: RegExp,
    error: {
        reason: string,
        toasterPath: string
    }
}
type Email = {
    regExps: {
        emailCharsRegEx: RegExp,
        localCharsRegEx: RegExp,
        domainCharsRegEx: RegExp,
        domainLabelCharsRegEx: RegExp,
    },
    error: {
        reason: string,
        toasterPath: string
    }
}

type SharedAppConfig = {
    dataValidation: {
        password: {
            rules: PasswordRule[]
        },
        email: {
            regExps: {
                emailCharsRegEx: RegExp,
                localCharsRegEx: RegExp,
                domainCharsRegEx: RegExp,
                domainLabelCharsRegEx: RegExp,
            }
        },
        allowedMimeTypes: AllowedMimeTypes
    }
}
