import React from 'react';
import { Button, Alert, Stack, ButtonProps } from '@mui/joy';

export interface IFormProps {
    children: React.ReactNode;
    onSubmit: () => void;
    footer?: React.ReactNode;
    submitLabel?: string;
    submitDisabled?: boolean;
    submitButtonColor?: ButtonProps['color'];
}

const DEFAULT_ERROR_MESSAGE = 'Sorry, cannot submit this form at the moment';

const Form = function ({ onSubmit, children, footer, submitLabel, submitButtonColor }: IFormProps) {
    const [pending, setPending] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

    const handleSubmit = async function () {
        setPending(true);

        try {
            await onSubmit();
        } catch (error) {
            setPending(false);
            console.error(error);

            if (error instanceof Error) {
                return setErrorMessage(error.message || DEFAULT_ERROR_MESSAGE);
            }

            if (typeof error === 'string') {
                return setErrorMessage(error || DEFAULT_ERROR_MESSAGE);
            }

            return setErrorMessage(DEFAULT_ERROR_MESSAGE);
        }

        setPending(false);
    };

    return (
        <React.Fragment>
            {errorMessage && (
                <Alert color="danger" sx={{ mb: 2 }}>
                    {errorMessage}
                </Alert>
            )}
            <Stack component="form" spacing={2}>
                {children}
            </Stack>
            <Button
                disabled={pending}
                loading={pending}
                loadingPosition="start"
                onClick={handleSubmit}
                sx={{ mt: 3, mb: 2 }}
                color={submitButtonColor}
                fullWidth
            >
                {submitLabel || 'Submit'}
            </Button>
            {footer}
        </React.Fragment>
    );
};

export default Form;
