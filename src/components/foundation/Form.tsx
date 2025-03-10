import Strings from '../../utils/string_dict.js';
import React from 'react';
import { Button, Alert, Stack, ButtonProps, AlertProps } from '@mui/joy';

export interface IFormProps {
    children: React.ReactNode;
    onSubmit: () => void;
    footer?: React.ReactNode;
    submitLabel?: string;
    submitDisabled?: boolean;
    submitButtonColor?: ButtonProps['color'];
    message?: string;
    messageColor?: AlertProps['color'];
}

const Form = function ({
                           onSubmit,
                           children,
                           footer,
                           submitLabel,
                           submitDisabled,
                           submitButtonColor,
                           message,
                           messageColor = 'danger',
                       }: IFormProps) {
    const [pending, setPending] = React.useState(false);

    const handleSubmit = async function () {
        setPending(true);
        await onSubmit();
        setPending(false);
    };

    return (
        <React.Fragment>
            {message && (
                <Alert color={messageColor} sx={{ mb: 2 }}>
                    {message}
                </Alert>
            )}
            <Stack component="form" spacing={2}>
                {children}
            </Stack>

            <Button
                disabled={pending || submitDisabled}
                loading={pending}
                loadingPosition="start"
                onClick={handleSubmit}
                color={submitButtonColor}
                sx={{ mt: 3, mb: 2 }}
                fullWidth
            >
                {submitLabel || Strings.submit}
            </Button>

            {footer}
        </React.Fragment>
    );
};

export default Form;
