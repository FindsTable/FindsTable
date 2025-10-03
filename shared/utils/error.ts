export {
    toasterError,
    newError
}

export type {
    ToasterErrorData,
    newErrorData
}

type ToasterError = {
    data : ToasterErrorData
}

interface ToasterErrorData {
    code: number;
    message: string;
    reason: string;
    toasterPath: string;
}

function toasterError(p: ToasterErrorData): Error & ToasterError {

    const err = new Error(p.message) as Error & ToasterError;

    err.data = {
        code: p.code,
        message: p.message,
        reason: p.reason,
        toasterPath: p.toasterPath
    }

    return err;
}

interface newErrorData {
    code: number;
    message: string;
    reason: string;
}

function newError(p: newErrorData): Error & newErrorData {

    const err = new Error(p.message) as Error & newErrorData;
    err.code = p.code;
    err.reason = p.reason;

    return err;
}
