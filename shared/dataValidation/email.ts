import { sharedAppConfig } from "../sharedAppConfig";


export {
    emailFormatIsValid,
    assertEmailFormat
};

const emailCharsRegEx = sharedAppConfig.dataValidation.email.regExps.emailCharsRegEx;
const localCharsRegEx = sharedAppConfig.dataValidation.email.regExps.localCharsRegEx;
const domainCharsRegEx = sharedAppConfig.dataValidation.email.regExps.domainCharsRegEx;
const domainLabelCharsRegEx = sharedAppConfig.dataValidation.email.regExps.domainLabelCharsRegEx;

function emailFormatIsValid(
    email : string
)  : boolean {
    try {
        emailFormatIsValid(email)
        return true
    } catch {
        return false
    }
}

function assertEmailFormat (
    email: string
) : void {
    try {
        assertLength(email, 5, 245);
        assertRegEx(email, emailCharsRegEx);
        assertIncludesChars(email, ['@', '.']);
        assertValidStartEnd(email, ['.', '@']);
        assertExcludesPattern(email, ['..', ' ', '@@']);

        const parts = localAndDomains(email);


        // Local validation
        assertRegEx(parts.local, localCharsRegEx)
        assertLength(parts.local, 1, 64);
        assertValidStartEnd(parts.local, ['.']);

        // Domains validation
        assertRegEx(parts.domains, domainCharsRegEx);
        assertLength(parts.domains, 1, 255);
        assertValidStartEnd(parts.domains, ['.', '-']);

        // Sub domains validation
        const labels = parts.domains.split('.');

        for(let label of labels) {
            assertRegEx(label, domainLabelCharsRegEx);
            assertLength(label, 1, 63);
            assertValidStartEnd(label, ['-']);
        }
    } catch(err) {
        throw toasterError({
            code: 401,
            message: "Bad request",
            reason: sharedAppConfig.dataValidation.email.error.reason,
            toasterPath: sharedAppConfig.dataValidation.email.error.toasterPath
        });
    }
}


function assertValidStartEnd(
    str: string,
    chars: string[]
) : void {
    const first = str[0];
    const last = str[str.length - 1];

    for (const char of chars) {
        if (first === char || last === char) throw new Error();
    }
}

function assertLength(
    str : string,
    min: number,
    max: number
) : void {
    const l = str.length;
    if(l < min || l > max) throw new Error()
}

function assertRegEx(
    str : string,
    regEx : RegExp
) : void {
    if(!regEx.test(str)) throw new Error()
}

function assertIncludesChars(
    str : string,
    chars: string[]
) : void {
    for(const char of chars) {
        if(! str.includes(char)) throw new Error()
    }
}

function assertExcludesPattern(
    str: string, 
    patterns: string[]
): void {
    for(const pat of patterns) {
        if(str.includes(pat)) throw new Error()
    }
}

function localAndDomains(
    email : string
) : {
    local: string,
    domains: string
} {
    let parts = email.split("@");

    if(parts.length !== 2) throw new Error();

    if (
        typeof parts[0] !== 'string' || 
        typeof parts[1] !== 'string'
    ) throw new Error();
    
    return {
        local: parts[0], 
        domains: parts[1]
    }
}