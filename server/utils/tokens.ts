import crypto from 'crypto';

export {
    randomToken
}

function randomToken(): string {
    return crypto.randomBytes(16).toString('hex')
}