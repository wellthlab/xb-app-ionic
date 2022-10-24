import React from 'react';
import { Button, Alert, Stack, ButtonProps } from '@mui/joy';

import getErrorMessage from '../../utils/getErrorMessage';

export interface IFormProps {
    children: React.ReactNode;
    onSubmit: () => void;
    footer?: React.ReactNode;
    extraButtonLabel?: string;
    onExtraButtonClick?: () => void;
    submitLabel?: string;
    submitDisabled?: boolean;
    submitButtonColor?: ButtonProps['color'];
}

const Form = function ({
    onSubmit,
    children,
    footer,
    submitLabel,
    submitButtonColor,
    onExtraButtonClick,
    extraButtonLabel,
}: IFormProps) {
    const [pending, setPending] = React.useState(false);
    const [extraButtonPending, setExtraButtonPending] = React.useState(false);
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

    const handleExtraButtonClick = async function () {
        if (!onExtraButtonClick) {
            return;
        }

        setExtraButtonPending(true);

        try {
            await onExtraButtonClick();
        } catch (error) {
            console.error(error);
            setErrorMessage(getErrorMessage(error, 'Sorry, cannot perform this action at the moment'));
        } finally {
            setExtraButtonPending(false);
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
            <Stack direction="row" spacing={1} sx={{ mt: 3, mb: 2 }}>
                {extraButtonLabel ? (
                    <Button
                        color="neutral"
                        disabled={pending || extraButtonPending}
                        loading={extraButtonPending}
                        loadingPosition="start"
                        fullWidth
                        onClick={handleExtraButtonClick}
                    >
                        {extraButtonLabel}
                    </Button>
                ) : null}
                <Button
                    disabled={pending || extraButtonPending}
                    loading={pending}
                    loadingPosition="start"
                    onClick={handleSubmit}
                    color={submitButtonColor}
                    fullWidth
                >
                    {submitLabel || 'Submit'}
                </Button>
            </Stack>
            {footer}
        </React.Fragment>
    );
};

export default Form;
