const getErrorMessage = function (error: unknown, defaultMessage: string) {
    let message;
    if (error instanceof Error || typeof error === 'object') {
        message = (error as any).message;
    }

    if (typeof error === 'string') {
        message = error;
    }

    if (!message) {
        message = defaultMessage;
    }

    return message;
};

export default getErrorMessage;
