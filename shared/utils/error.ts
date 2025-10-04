export {
    toasterError,
    newError
}

export type {
    ToasterErrorData,
    NewErrorData
}

type ToasterError = {
    data : ToasterErrorData
}

type ToasterErrorData = {
    code: number;
    message: string;
    reason: string;
    toasterPath: string;
}

function toasterError(p: ToasterErrorData): Error & ToasterError {
    console.log('building toasterError')
    const err = new Error() as Error & ToasterError;

    err.data = p;

    return err;
}

type NewError = {
    data: NewErrorData;
}

type NewErrorData = {
    code: number;
    message: string;
    reason: string;
}

function newError(p: NewErrorData): Error & NewError {
    console.log('building tnewError')
    const err = new Error() as Error & NewError;

    return err;
}
