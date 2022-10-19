import React from 'react';
import { Button, Alert, Stack, ButtonProps } from '@mui/joy';

import getErrorMessage from '../../utils/getErrorMessage';

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
            console.error(error);
            setErrorMessage(getErrorMessage(error, DEFAULT_ERROR_MESSAGE));
        } finally {
            setPending(false);
        }
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
