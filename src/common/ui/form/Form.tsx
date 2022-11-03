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

const Form = function ({ onSubmit, children, footer, submitLabel, submitButtonColor }: IFormProps) {
    const [pending, setPending] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState<string>();

    const handleSubmit = async function () {
        setPending(true);

        try {
            await onSubmit();
        } catch (error) {
            console.error(error);
            setErrorMessage(getErrorMessage(error, 'Sorry, cannot submit this form at the moment'));
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
                color={submitButtonColor}
                sx={{ mt: 3, mb: 2 }}
                fullWidth
            >
                {submitLabel || 'Submit'}
            </Button>

            {footer}
        </React.Fragment>
    );
};

export default Form;
