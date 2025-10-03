import {
    emailFormatIsValid,
    assertEmailFormat
} from '../dataValidation/email';
import {
    assertPasswordFormat,
    passwordFormatIsValid
} from '../dataValidation/password';
import {
    areStrongEqual,
    assertStrongEquality
} from '../dataValidation/misc';
import { usernameValidation, assertUsernameIsUnique } from '../dataValidation/username';

export {
    validate,
    emailFormatIsValid,
    assertEmailFormat,
    passwordFormatIsValid,
    assertPasswordFormat,
    areStrongEqual,
    assertStrongEquality,
    usernameValidation,
    assertUsernameIsUnique
}

const validate = {
    passwordLength: (password: string): boolean => {
        return password.length >= 1
    },
    emailFormat: (email: string) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        return emailRegex.test(email);
    },
    areEqual(one: any, two: any) {
        return one === two
    }
}